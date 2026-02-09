import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const ChangePointChart = ({ changePoint }) => {
	if (!changePoint) {
		return null;
	}

	const data = [
		{ label: "Before", value: changePoint.mu_before ?? 0 },
		{ label: "After", value: changePoint.mu_after ?? 0 },
	];

	return (
		<div className="card">
			<h3>Average daily return shift</h3>
			<div className="chart-container">
				<ResponsiveContainer width="100%" height={220}>
					<BarChart data={data} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
						<XAxis dataKey="label" tick={{ fill: "#5d6570" }} />
						<YAxis tick={{ fill: "#5d6570" }} />
						<Tooltip formatter={(value) => [Number(value).toFixed(4), "Return"]} />
						<Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<span className="tag">
				Change point: {changePoint.mode_date || "N/A"}
			</span>
		</div>
	);
};

export default ChangePointChart;
