## Task 1: Laying the Foundation for Analysis (Interim Submission)

### Defining the Data Analysis Workflow

#### 1) Data Acquisition & Preparation
- Load Brent daily prices (May 20, 1987–Sep 30, 2022).
- Parse `Date` as datetime (day-first format for `dd-mmm-yy`).
- Check for gaps/missing values and forward-fill if minor; align to business days if needed.
- Create derived features:
	- Log prices
	- Daily log returns: $\log(P_t) - \log(P_{t-1})$

#### 2) Exploratory Data Analysis (EDA)
- Plot raw prices over time and annotate suspected shocks.
- Plot log returns to visualize volatility clustering.
- Stationarity tests:
	- ADF/KPSS on prices (expect non-stationary)
	- ADF/KPSS on log returns (expect stationary)
- Decompose series into trend/seasonal/residual (statsmodels).
- Rolling stats (e.g., 30-day volatility) to spot regimes.

#### 3) Event Compilation & Overlay
- Load the events dataset (15 key events from 2012–2022).
- Overlay vertical lines or shaded regions on price/return plots.

#### 4) Bayesian Change Point Modeling (PyMC)
- Focus on 2012–2022 for change-point inference.
- Start with a single change point $\tau \sim \text{DiscreteUniform}$.
- Priors:
	- Regime means: Normal (weakly informative)
	- Switch: $\mu = \text{switch}(t < \tau, \mu_1, \mu_2)$
- Likelihood: Normal on log returns (also test prices).
- Sample with NUTS (4 chains, 2000+ draws).
- Diagnostics: trace plots, $\hat{R} < 1.01$, ESS $> 400$.

#### 5) Interpretation & Causal Association
- Posterior of $\tau$ gives most probable change dates.
- Compare with event list to hypothesize links.
- Quantify regime shift with credible intervals for $\Delta\mu$.
- Example statement: “80% posterior probability of regime shift within ±5 days of event X.”

#### 6) Validation, Reporting & Dashboard Prep
- Sensitivity checks (priors, multiple $\tau$ values).
- Export posteriors/visuals for the Flask API.
- Compile report and notebook for interim submission.

### Structured Event Dataset (2012–2022)
Saved as [data/events/brent_key_events_2012_2022.csv](data/events/brent_key_events_2012_2022.csv).

### Interim Deliverables
- Cleaned dataset + derived log returns.
- EDA plots with event overlays.
- Events CSV (15 items, 2012–2022).
- Methods + assumptions/limitations documentation.

