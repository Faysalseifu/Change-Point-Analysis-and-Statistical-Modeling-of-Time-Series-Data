import React from "react";

import PageHeader from "../components/common/PageHeader";

const Analysis = () => (
	<>
		<PageHeader
			title="Price trend analysis"
			subtitle="Deep-dive into rolling returns, volatility, and market regimes."
		/>
		<div className="card">
			<h3>Analysis workspace</h3>
			<p className="stats-caption">
				Add extended trend diagnostics and time window comparisons here.
			</p>
		</div>
	</>
);

export default Analysis;
