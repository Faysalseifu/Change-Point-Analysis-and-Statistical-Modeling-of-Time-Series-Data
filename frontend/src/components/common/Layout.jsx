import React from "react";
import { NavLink } from "react-router-dom";

import Footer from "./Footer";

const Layout = ({ children }) => (
	<div className="app-shell">
		<div className="dashboard-shell">
			<aside className="nav-panel">
				<div className="nav-profile">
					<div className="nav-avatar" />
					<div>
						<div className="nav-name">John Don</div>
						<div className="nav-email">john@company.com</div>
					</div>
				</div>
				<nav className="nav-links">
					<NavLink to="/" end className="nav-item">
						Overview
					</NavLink>
					<NavLink to="/analysis" className="nav-item">
						Price trend
					</NavLink>
					<NavLink to="/events" className="nav-item">
						Events
					</NavLink>
					<NavLink to="/models" className="nav-item">
						Models
					</NavLink>
					<NavLink to="/reports" className="nav-item">
						Reports
					</NavLink>
				</nav>
				<div className="nav-footer">Brent analytics 2012-2022</div>
			</aside>
			<main className="page">{children}</main>
		</div>
		<Footer />
	</div>
);

export default Layout;
