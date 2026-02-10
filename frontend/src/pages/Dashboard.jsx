import React, { useEffect, useMemo, useState } from "react";

import ChangePointChart from "../components/charts/ChangePointChart";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";
import EventTimeline from "../components/analysis/EventTimeline";
import ImpactAnalysis from "../components/analysis/ImpactAnalysis";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Sidebar from "../components/common/Sidebar";
import Overview from "../components/dashboard/Overview";
import {
	fetchChangePoints,
	fetchEvents,
	fetchHealth,
	fetchPrices,
	fetchStats,
} from "../services/api";
import {
	formatDate,
	inRange,
	normalizeEvents,
	normalizePriceSeries,
} from "../services/dataProcessing";

const DEFAULT_START = "2012-01-01";
const DEFAULT_END = "2022-09-30";

const Dashboard = () => {
	const [prices, setPrices] = useState([]);
	const [events, setEvents] = useState([]);
	const [changePoint, setChangePoint] = useState(null);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [refreshTick, setRefreshTick] = useState(0);
	const [apiStatus, setApiStatus] = useState("unknown");
	const [startDate, setStartDate] = useState(DEFAULT_START);
	const [endDate, setEndDate] = useState(DEFAULT_END);
	const [eventFilter, setEventFilter] = useState("");
	const [downloadReady, setDownloadReady] = useState(false);

	useEffect(() => {
		let isActive = true;
		const loadData = async () => {
			setLoading(true);
			setError("");
			try {
				const [priceData, eventData, cpData, statsData] = await Promise.all([
					fetchPrices(startDate, endDate),
					fetchEvents(),
					fetchChangePoints(),
					fetchStats(),
				]);

				if (!isActive) return;
				setPrices(normalizePriceSeries(priceData));
				setEvents(normalizeEvents(eventData));
				setChangePoint(cpData);
				setStats(statsData);
			} catch (error) {
				console.error("Failed to load dashboard data", error);
				setError(
					"Backend API is unreachable. Start the Flask server and retry."
				);
			} finally {
				if (isActive) setLoading(false);
			}
		};

		const checkHealth = async () => {
			try {
				await fetchHealth();
				if (isActive) setApiStatus("online");
			} catch (error) {
				if (isActive) setApiStatus("offline");
			}
		};

		loadData();
		checkHealth();
		return () => {
			isActive = false;
		};
	}, [startDate, endDate, refreshTick]);

	const filteredEvents = useMemo(() => {
		return events
			.filter((event) => inRange(event.date, startDate, endDate))
			.filter((event) =>
				eventFilter
					? event.category.toLowerCase().includes(eventFilter.toLowerCase())
					: true
			)
			.slice(0, 14);
	}, [events, startDate, endDate, eventFilter]);

	const metrics = useMemo(() => {
		if (!prices.length) return null;
		const startPrice = prices[0].price;
		const endPrice = prices[prices.length - 1].price;
		const changePct = startPrice
			? ((endPrice - startPrice) / startPrice) * 100
			: 0;
		const priceValues = prices.map((item) => item.price);
		const avgPrice =
			priceValues.reduce((sum, value) => sum + value, 0) / priceValues.length;
		const rangeHigh = Math.max(...priceValues);
		const rangeLow = Math.min(...priceValues);
		const returns = prices
			.slice(1)
			.map((item, index) => (item.price - prices[index].price) / prices[index].price)
			.filter((value) => Number.isFinite(value));
		const meanReturn = returns.length
			? returns.reduce((sum, value) => sum + value, 0) / returns.length
			: 0;
		const variance = returns.length
			? returns.reduce((sum, value) => sum + (value - meanReturn) ** 2, 0) /
			  returns.length
			: 0;
		const volatility = Math.sqrt(variance) * Math.sqrt(252);

		return {
			startPrice,
			endPrice,
			changePct,
			avgPrice,
			rangeHigh,
			rangeLow,
			volatility,
			eventCount: filteredEvents.length,
		};
	}, [prices, filteredEvents.length]);

	const outlook = useMemo(() => {
		if (prices.length < 2) return null;
		const window = Math.min(30, prices.length - 1);
		const start = prices[prices.length - 1 - window].price;
		const end = prices[prices.length - 1].price;
		const delta = end - start;
		const deltaPct = start ? (delta / start) * 100 : 0;
		const direction = delta > 0 ? "Upward" : delta < 0 ? "Downward" : "Flat";
		return {
			window,
			deltaPct,
			avgDaily: delta / window,
			direction,
		};
	}, [prices]);

	const alerts = useMemo(() => {
		if (!metrics) return [];
		const items = [];
		if (metrics.changePct <= -10) {
			items.push({
				title: "Range drawdown", 
				detail: "Prices fell more than 10% in the selected window.",
			});
		}
		if (metrics.volatility > 0.5) {
			items.push({
				title: "Elevated volatility",
				detail: "Annualized volatility exceeds 0.5.",
			});
		}
		if (changePoint?.mode_date && inRange(changePoint.mode_date, startDate, endDate)) {
			items.push({
				title: "Change point in view",
				detail: "Model change point falls within the selected window.",
			});
		}
		if (metrics.eventCount > 10) {
			items.push({
				title: "Event dense period",
				detail: "More than 10 highlighted events in range.",
			});
		}
		return items;
	}, [metrics, changePoint, startDate, endDate]);

	const handleEventSelect = (event) => {
		if (!event?.date) return;
		const pivot = new Date(event.date);
		const start = new Date(pivot);
		const end = new Date(pivot);
		start.setDate(start.getDate() - 90);
		end.setDate(end.getDate() + 90);
		setStartDate(formatDate(start));
		setEndDate(formatDate(end));
	};

	const handleDownload = () => {
		if (!prices.length) return;
		const header = "Date,Price";
		const rows = prices.map((row) => `${row.date},${row.price}`);
		const csv = [header, ...rows].join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `brent_prices_${startDate}_${endDate}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		setDownloadReady(true);
	};

	return (
		<div className="app-shell">
			<div className="page">
				<Header />
				<div className="card">
					{apiStatus === "offline" && (
						<div className="status-banner">
							<strong>Backend offline</strong>
							<span>
								Start `python backend/app.py` and keep it running.
							</span>
						</div>
					)}
					<div className="filters">
						<label>
							Start date
							<input
								type="date"
								value={startDate}
								onChange={(event) => setStartDate(event.target.value)}
							/>
						</label>
						<label>
							End date
							<input
								type="date"
								value={endDate}
								onChange={(event) => setEndDate(event.target.value)}
							/>
						</label>
						<label>
							Event category
							<input
								type="text"
								placeholder="Filter by category"
								value={eventFilter}
								onChange={(event) => setEventFilter(event.target.value)}
							/>
						</label>
						<button
							type="button"
							onClick={() => {
								setStartDate(DEFAULT_START);
								setEndDate(DEFAULT_END);
								setEventFilter("");
									setDownloadReady(false);
							}}
						>
							Reset filters
						</button>
							<button type="button" className="button-secondary" onClick={handleDownload}>
								Download CSV
							</button>
							{downloadReady && (
								<span className="tag">Download ready</span>
							)}
					</div>
				</div>

				{loading ? (
					<LoadingSpinner />
				) : error ? (
					<div className="card error-card">
						<h3>Data fetch failed</h3>
						<p>{error}</p>
						<button type="button" onClick={() => setRefreshTick((value) => value + 1)}>
							Retry
						</button>
					</div>
				) : prices.length === 0 ? (
					<div className="card">
						<h3>No price data available</h3>
						<p>
							The backend returned an empty dataset. Check that
							 `data/raw/brent_prices.csv` exists and try a broader date range.
						</p>
					</div>
				) : (
					<div className="grid" style={{ marginTop: "24px" }}>
						<Overview metrics={metrics} outlook={outlook} alerts={alerts} />
						<TimeSeriesChart
							prices={prices}
							events={filteredEvents}
							changePoint={changePoint}
						/>
						<div className="grid grid-2">
							<ChangePointChart changePoint={changePoint} />
							<Sidebar stats={stats} changePoint={changePoint} />
						</div>
						<ImpactAnalysis stats={stats} />
						<EventTimeline events={filteredEvents} onSelect={handleEventSelect} />
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default Dashboard;
