import React from "react";

const ForecastPanel = ({ outlook }) => {
	if (!outlook) return null;

	return (
		<div className="card">
			<h3>Short-term momentum</h3>
			<div className="stats-value">{outlook.direction}</div>
			<div className="stats-caption">
				{outlook.window} day change: {outlook.deltaPct.toFixed(2)}%
			</div>
			<div className="stats-caption">
				Avg daily move: {outlook.avgDaily.toFixed(3)}
			</div>
		</div>
	);
};

export default ForecastPanel;
