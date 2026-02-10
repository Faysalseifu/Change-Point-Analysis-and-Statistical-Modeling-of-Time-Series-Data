import React from "react";

const AlertsPanel = ({ alerts }) => (
	<div className="card">
		<h3>Alerts & signals</h3>
		{alerts.length === 0 ? (
			<div className="stats-caption">No critical signals detected.</div>
		) : (
			<ul className="alert-list">
				{alerts.map((alert, index) => (
					<li key={`${alert.title}-${index}`}>
						<strong>{alert.title}</strong>
						<div className="stats-caption">{alert.detail}</div>
					</li>
				))}
			</ul>
		)}
	</div>
);

export default AlertsPanel;
