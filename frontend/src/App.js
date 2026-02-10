import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Layout from "./components/common/Layout";
import Analysis from "./pages/Analysis";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Models from "./pages/Models";
import Reports from "./pages/Reports";

const App = () => (
	<BrowserRouter>
		<Layout>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/analysis" element={<Analysis />} />
				<Route path="/events" element={<Events />} />
				<Route path="/models" element={<Models />} />
				<Route path="/reports" element={<Reports />} />
			</Routes>
		</Layout>
	</BrowserRouter>
);

export default App;
