## Understanding the Model and Data (Task 1)

### Key References Reviewed
- PyMC change point modeling examples and tutorials.
- Bayesian change point detection overviews (e.g., ruptures concepts).
- MCMC/Bayesian inference documentation (PyMC docs and probabilistic programming guides).

### Time Series Properties (Conceptual)
- **Trend**: Uptrend 2011–2014 (>$100), sharp collapse 2014–2016 (oversupply), lows in 2020, surge in 2022 (geopolitics).
- **Stationarity**: Raw prices likely non-stationary; log returns closer to stationary.
- **Volatility**: Clustering around 2014–2016 glut, 2020 pandemic, 2022 war.

These properties inform the initial modeling choice: use log returns and allow regime changes in mean (and potentially variance in future iterations).

### Change Point Models: Purpose
Change point models detect structural breaks (mean/volatility shifts) in non-stationary series. A Bayesian formulation provides:
- Posterior uncertainty on timing of change(s).
- Credible intervals for magnitude of change.
- Probabilistic linkage to external events (temporal association, not causation).

### Expected Outputs
- Posterior density of $\tau$ (change date).
- Pre/post parameters (e.g., $\mu_1$, $\mu_2$, $\sigma$).
- Credible intervals for $\Delta\mu$.
- Annotated plots with event overlays.

### Limitations (Modeling)
- Abrupt-change assumption can miss gradual shifts.
- Single-change model may be oversimplified; multiple-change extensions needed.
- External confounders can align with change points without causality.
- MCMC convergence requires diagnostics and tuning.

