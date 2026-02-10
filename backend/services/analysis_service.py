from functools import lru_cache
from pathlib import Path

import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
RESULTS_DIR = BASE_DIR / "results"


def _is_non_empty(path: Path) -> bool:
	return path.exists() and path.stat().st_size > 0


def _normalize_event_date(value: str) -> str:
	if value is None:
		return ""
	text = str(value).strip()
	if not text:
		return ""
	if len(text) == 7:
		text = f"{text}-01"
	parsed = pd.to_datetime(text, errors="coerce")
	if pd.isna(parsed):
		return ""
	return parsed.strftime("%Y-%m-%d")


@lru_cache(maxsize=1)
def _load_prices() -> pd.DataFrame:
	processed_path = DATA_DIR / "processed" / "clean_prices.csv"
	raw_path = DATA_DIR / "raw" / "brent_prices.csv"
	source_path = processed_path if _is_non_empty(processed_path) else raw_path
	df = pd.read_csv(source_path)

	if "Date" not in df.columns:
		raise ValueError("Price data must include a Date column.")
	if "Price" not in df.columns:
		price_candidates = [col for col in df.columns if col.lower().startswith("price")]
		if not price_candidates:
			raise ValueError("Price data must include a Price column.")
		df = df.rename(columns={price_candidates[0]: "Price"})

	df["Date"] = pd.to_datetime(df["Date"], errors="coerce", dayfirst=True)
	df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
	df = df.dropna(subset=["Date", "Price"]).sort_values("Date").reset_index(drop=True)
	return df


@lru_cache(maxsize=1)
def _load_events() -> pd.DataFrame:
	processed_path = DATA_DIR / "events" / "events_processed.csv"
	raw_path = DATA_DIR / "events" / "brent_key_events_2012_2022.csv"
	source_path = processed_path if _is_non_empty(processed_path) else raw_path
	try:
		df = pd.read_csv(source_path, engine="python")
	except Exception:
		rows = []
		with source_path.open("r", encoding="utf-8") as handle:
			lines = handle.read().splitlines()
		if lines:
			for line in lines[1:]:
				if not line.strip():
					continue
				parts = [part.strip() for part in line.split(",")]
				if len(parts) < 4:
					continue
				date = parts[0]
				category = parts[-2]
				impact = parts[-1]
				description = ",".join(parts[1:-2]).strip()
				rows.append(
					{
						"Date": date,
						"Event_Description": description,
						"Category": category,
						"Likely_Brent_Impact": impact,
					}
				)
		df = pd.DataFrame(rows)
	if "Date" in df.columns:
		df["Date"] = df["Date"].apply(_normalize_event_date)
	return df


def get_prices_in_range(start: str | None, end: str | None) -> list[dict]:
	df = _load_prices().copy()
	start_dt = pd.to_datetime(start, errors="coerce") if start else df["Date"].min()
	end_dt = pd.to_datetime(end, errors="coerce") if end else df["Date"].max()
	if pd.isna(start_dt):
		start_dt = df["Date"].min()
	if pd.isna(end_dt):
		end_dt = df["Date"].max()

	mask = (df["Date"] >= start_dt) & (df["Date"] <= end_dt)
	filtered = df.loc[mask].copy()
	filtered["Date"] = filtered["Date"].dt.strftime("%Y-%m-%d")
	return filtered[["Date", "Price"]].to_dict(orient="records")


def get_events() -> list[dict]:
	df = _load_events().copy()
	df = df.fillna("")
	if "Date" in df.columns:
		df["Date"] = df["Date"].astype(str)
	return df.to_dict(orient="records")


def _default_change_point(prices: pd.DataFrame) -> dict:
	if prices.empty:
		return {
			"mode_date": "",
			"hdi_low": "",
			"hdi_high": "",
			"mu_before": 0.0,
			"mu_after": 0.0,
		}

	target = pd.to_datetime("2014-11-27")
	nearest_idx = (prices["Date"] - target).abs().idxmin()
	cp_date = prices.loc[nearest_idx, "Date"]
	returns = prices["Price"].pct_change().dropna()
	before_mask = prices["Date"].iloc[1:] <= cp_date
	after_mask = prices["Date"].iloc[1:] > cp_date
	mu_before = float(returns[before_mask].mean()) if before_mask.any() else 0.0
	mu_after = float(returns[after_mask].mean()) if after_mask.any() else 0.0
	hdi_low = (cp_date - pd.Timedelta(days=45)).strftime("%Y-%m-%d")
	hdi_high = (cp_date + pd.Timedelta(days=45)).strftime("%Y-%m-%d")
	return {
		"mode_date": cp_date.strftime("%Y-%m-%d"),
		"hdi_low": hdi_low,
		"hdi_high": hdi_high,
		"mu_before": mu_before,
		"mu_after": mu_after,
	}


def get_change_points() -> dict:
	prices = _load_prices()
	trace_path = RESULTS_DIR / "models" / "trace.nc"
	if _is_non_empty(trace_path):
		try:
			import arviz as az

			idata = az.from_netcdf(trace_path)
			posterior = idata.posterior
			tau_values = None
			for name in ["tau", "changepoint", "cp", "tau_idx", "t"]:
				if name in posterior:
					tau_values = posterior[name].values.flatten()
					break

			if tau_values is not None and tau_values.size:
				tau_values = tau_values.astype(float)
				median_idx = int(np.median(tau_values))
				median_idx = max(0, min(median_idx, len(prices) - 1))
				cp_date = prices.loc[median_idx, "Date"]

				hdi = az.hdi(tau_values, hdi_prob=0.94)
				hdi_low_idx = max(0, min(int(hdi[0]), len(prices) - 1))
				hdi_high_idx = max(0, min(int(hdi[1]), len(prices) - 1))

				returns = prices["Price"].pct_change().dropna()
				before_mask = prices["Date"].iloc[1:] <= cp_date
				after_mask = prices["Date"].iloc[1:] > cp_date
				mu_before = float(returns[before_mask].mean()) if before_mask.any() else 0.0
				mu_after = float(returns[after_mask].mean()) if after_mask.any() else 0.0

				return {
					"mode_date": cp_date.strftime("%Y-%m-%d"),
					"hdi_low": prices.loc[hdi_low_idx, "Date"].strftime("%Y-%m-%d"),
					"hdi_high": prices.loc[hdi_high_idx, "Date"].strftime("%Y-%m-%d"),
					"mu_before": mu_before,
					"mu_after": mu_after,
				}
		except Exception:
			pass

	return _default_change_point(prices)


def get_key_stats() -> dict:
	df = _load_prices()
	returns = df["Price"].pct_change()
	vol_30d = returns.rolling(30).std().iloc[-1]
	vol_annualized = float(vol_30d * np.sqrt(252)) if pd.notna(vol_30d) else 0.0
	return {
		"avg_price_2012_2022": float(df["Price"].mean()),
		"max_price": float(df["Price"].max()),
		"min_price": float(df["Price"].min()),
		"volatility_annualized": vol_annualized,
	}
