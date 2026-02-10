import React from "react";

import PageHeader from "../components/common/PageHeader";

const Reports = () => (
	<>
		<PageHeader
			title="Reports & snapshots"
			subtitle="Capture insights and export visuals for stakeholders."
		/>
		<div className="card">
			<h3>Reporting center</h3>
			<p className="stats-caption">
				Add exportable summaries and screenshots for the final submission.
			</p>
		</div>
	</>
);

export default Reports;
