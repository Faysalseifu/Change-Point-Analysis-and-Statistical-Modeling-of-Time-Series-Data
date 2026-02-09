import React from "react";

const LoadingSpinner = ({ label = "Loading dashboard data" }) => (
	<div className="loading">
		<div>
			<div className="spinner" />
			<div className="tag" style={{ marginTop: "12px", textAlign: "center" }}>
				{label}
			</div>
		</div>
	</div>
);

export default LoadingSpinner;
