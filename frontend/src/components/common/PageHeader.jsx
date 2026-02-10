import React from "react";

const PageHeader = ({ title, subtitle }) => (
	<header className="hero">
		<h1>{title}</h1>
		<p>{subtitle}</p>
	</header>
);

export default PageHeader;
