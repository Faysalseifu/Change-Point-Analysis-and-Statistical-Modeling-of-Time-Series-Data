import React from "react";

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

const KeyMetrics = ({ metrics }) => {
	if (!metrics) return null;

	const cards = [
		{
			label: "Start price",
			value: formatCurrency(metrics.startPrice),
			caption: "First observation in range",
		},
		{
			label: "End price",
			value: formatCurrency(metrics.endPrice),
			caption: "Latest observation in range",
		},
		{
			label: "Range change",
			value: `${metrics.changePct.toFixed(2)}%`,
			caption: "Percent change across window",
		},
		{
			label: "Average price",
			value: formatCurrency(metrics.avgPrice),
			caption: "Mean over selected dates",
		},
		{
			label: "High / Low",
			value: `${formatCurrency(metrics.rangeHigh)} / ${formatCurrency(
				metrics.rangeLow
			)}`,
			caption: "Range extremes",
		},
		{
			label: "Events in range",
			value: `${metrics.eventCount}`,
			caption: "Filtered events",
		},
	];

	return (
		<div className="grid grid-3">
			{cards.map((card) => (
				<div className="card" key={card.label}>
					<h3>{card.label}</h3>
					<div className="stats-value">{card.value}</div>
					<div className="stats-caption">{card.caption}</div>
				</div>
			))}
		</div>
	);
};

export default KeyMetrics;
