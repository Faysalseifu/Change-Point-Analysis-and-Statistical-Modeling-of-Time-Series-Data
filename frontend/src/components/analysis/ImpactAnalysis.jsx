import React from "react";

const ImpactAnalysis = ({ stats }) => {
	if (!stats) return null;

	const rows = [
		{
			label: "Average price (2012-2022)",
			value: `$${stats.avg_price_2012_2022?.toFixed(2) || "0.00"}`,
			caption: "Mean of daily prices",
		},
		{
			label: "Max price",
			value: `$${stats.max_price?.toFixed(2) || "0.00"}`,
			caption: "Highest observed close",
		},
		{
			label: "Min price",
			value: `$${stats.min_price?.toFixed(2) || "0.00"}`,
			caption: "Lowest observed close",
		},
		{
			label: "Annualized volatility",
			value: `${(stats.volatility_annualized || 0).toFixed(2)}`,
			caption: "30-day rolling std",
		},
	];

	return (
		<div className="grid grid-2">
			{rows.map((row) => (
				<div className="card" key={row.label}>
					<h3>{row.label}</h3>
					<div className="stats-value">{row.value}</div>
					<div className="stats-caption">{row.caption}</div>
				</div>
			))}
		</div>
	);
};

export default ImpactAnalysis;
