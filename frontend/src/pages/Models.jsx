import React from "react";

import PageHeader from "../components/common/PageHeader";

const Models = () => (
	<>
		<PageHeader
			title="Model outputs"
			subtitle="Inspect the change point inference and posterior diagnostics."
		/>
		<div className="card">
			<h3>Model diagnostics</h3>
			<p className="stats-caption">
				Include posterior summaries, trace plots, and diagnostics in this view.
			</p>
		</div>
	</>
);

export default Models;
