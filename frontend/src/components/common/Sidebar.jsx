import React from "react";

const Sidebar = ({ stats, changePoint }) => (
	<div className="grid grid-2">
		<div className="card">
			<h3>Change point window</h3>
			<p className="stats-caption">94% credible interval for the shift</p>
			<div className="stats-value">{changePoint?.mode_date || "N/A"}</div>
			<p className="stats-caption">
				HDI: {changePoint?.hdi_low || "-"} to {changePoint?.hdi_high || "-"}
			</p>
		</div>
		<div className="card">
			<h3>Latest volatility</h3>
			<p className="stats-caption">Annualized 30-day rolling</p>
			<div className="stats-value">
				{stats?.volatility_annualized ? stats.volatility_annualized.toFixed(2) : "0.00"}
			</div>
		</div>
	</div>
);

export default Sidebar;
