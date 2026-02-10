import React from "react";

import AlertsPanel from "./AlertsPanel";
import ForecastPanel from "./ForecastPanel";
import KeyMetrics from "./KeyMetrics";

const Overview = ({ metrics, outlook, alerts }) => (
	<div className="grid" style={{ marginTop: "12px" }}>
		<KeyMetrics metrics={metrics} />
		<div className="grid grid-2">
			<ForecastPanel outlook={outlook} />
			<AlertsPanel alerts={alerts} />
		</div>
	</div>
);

export default Overview;
