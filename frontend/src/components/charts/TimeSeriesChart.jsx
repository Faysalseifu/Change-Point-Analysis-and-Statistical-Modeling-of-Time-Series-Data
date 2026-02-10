import React from "react";
import {
	Brush,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceArea,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const TimeSeriesChart = ({ prices, events, changePoint }) => {
	const highlightEvents = (events || []).slice(0, 18);

	return (
		<div className="card">
			<h3>Brent price trend with event markers</h3>
			<div className="chart-container">
				<ResponsiveContainer width="100%" height={380}>
					<LineChart data={prices} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
						<XAxis dataKey="date" tick={{ fill: "#5d6570" }} minTickGap={28} />
						<YAxis
							tick={{ fill: "#5d6570" }}
							domain={[(dataMin) => dataMin * 0.9, (dataMax) => dataMax * 1.05]}
						/>
						<Tooltip
							formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
							labelFormatter={(label) => `Date: ${label}`}
						/>
						<Legend />
						{changePoint?.hdi_low && changePoint?.hdi_high && (
							<ReferenceArea
								x1={changePoint.hdi_low}
								x2={changePoint.hdi_high}
								yAxisId={0}
								fill="#fdba74"
								fillOpacity={0.25}
								ifOverflow="extendDomain"
							/>
						)}
						{changePoint?.mode_date && (
							<ReferenceLine
								x={changePoint.mode_date}
								stroke="#f97316"
								strokeWidth={2}
								label={{ value: "Change point", position: "top", fill: "#f97316" }}
							/>
						)}
						{highlightEvents.map((event, index) => (
							<ReferenceLine
								key={`${event.date}-${index}`}
								x={event.date}
								stroke="#0f172a"
								strokeDasharray="3 6"
								strokeOpacity={0.2}
								ifOverflow="hidden"
							/>
						))}
						<Line
							type="monotone"
							dataKey="price"
							stroke="#0f172a"
							strokeWidth={2}
							dot={false}
							name="Brent price"
						/>
						<Brush dataKey="date" height={26} stroke="#f97316" />
					</LineChart>
				</ResponsiveContainer>
			</div>
			<span className="tag">Event markers show the first 18 in range to reduce clutter.</span>
		</div>
	);
};

export default TimeSeriesChart;
