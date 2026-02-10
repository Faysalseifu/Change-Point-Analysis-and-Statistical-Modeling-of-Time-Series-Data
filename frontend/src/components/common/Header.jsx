import React from "react";

const Header = () => (
	<header className="hero">
		<div className="topbar">
			<div>
				<div className="brand">Brent Insights</div>
				<div className="tag">Market overview console</div>
			</div>
			<div className="user-chip">
				<button type="button" className="menu-button" aria-label="Open menu">
					<span />
					<span />
				</button>
				<span className="user-dot" />
				Dashboard User
			</div>
		</div>
		<span className="pill">Task 3 - Interactive Dashboard</span>
		<h1>Brent price shifts and event-driven context</h1>
		<p>
			Explore historical Brent prices, highlight geopolitical events, and review the
			model-inferred change point window.
		</p>
	</header>
);

export default Header;
