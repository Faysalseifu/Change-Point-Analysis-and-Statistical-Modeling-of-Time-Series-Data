import React from "react";

import PageHeader from "../components/common/PageHeader";

const Events = () => (
	<>
		<PageHeader
			title="Event explorer"
			subtitle="Review the geopolitical and economic events driving Brent volatility."
		/>
		<div className="card">
			<h3>Coming next</h3>
			<p className="stats-caption">
				This page will host advanced event filters and narrative summaries.
			</p>
		</div>
	</>
);

export default Events;
