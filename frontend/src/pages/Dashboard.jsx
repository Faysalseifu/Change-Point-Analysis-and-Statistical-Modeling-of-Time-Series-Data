import React, { useEffect, useMemo, useState } from "react";

import ChangePointChart from "../components/charts/ChangePointChart";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";
import EventTimeline from "../components/analysis/EventTimeline";
import ImpactAnalysis from "../components/analysis/ImpactAnalysis";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Sidebar from "../components/common/Sidebar";
import {
	fetchChangePoints,
	fetchEvents,
	fetchPrices,
	fetchStats,
} from "../services/api";
import {
	formatDate,
	inRange,
	normalizeEvents,
	normalizePriceSeries,
} from "../services/dataProcessing";

const DEFAULT_START = "2012-01-01";
const DEFAULT_END = "2022-09-30";

const Dashboard = () => {
	const [prices, setPrices] = useState([]);
	const [events, setEvents] = useState([]);
	const [changePoint, setChangePoint] = useState(null);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(DEFAULT_START);
	const [endDate, setEndDate] = useState(DEFAULT_END);
	const [eventFilter, setEventFilter] = useState("");

	useEffect(() => {
		let isActive = true;
		const loadData = async () => {
			setLoading(true);
			try {
				const [priceData, eventData, cpData, statsData] = await Promise.all([
					fetchPrices(startDate, endDate),
					fetchEvents(),
					fetchChangePoints(),
					fetchStats(),
				]);

				if (!isActive) return;
				setPrices(normalizePriceSeries(priceData));
				setEvents(normalizeEvents(eventData));
				setChangePoint(cpData);
				setStats(statsData);
			} catch (error) {
				console.error("Failed to load dashboard data", error);
			} finally {
				if (isActive) setLoading(false);
			}
		};

		loadData();
		return () => {
			isActive = false;
		};
	}, [startDate, endDate]);

	const filteredEvents = useMemo(() => {
		return events
			.filter((event) => inRange(event.date, startDate, endDate))
			.filter((event) =>
				eventFilter
					? event.category.toLowerCase().includes(eventFilter.toLowerCase())
					: true
			)
			.slice(0, 14);
	}, [events, startDate, endDate, eventFilter]);

	const handleEventSelect = (event) => {
		if (!event?.date) return;
		const pivot = new Date(event.date);
		const start = new Date(pivot);
		const end = new Date(pivot);
		start.setDate(start.getDate() - 90);
		end.setDate(end.getDate() + 90);
		setStartDate(formatDate(start));
		setEndDate(formatDate(end));
	};

	return (
		<div className="app-shell">
			<div className="page">
				<Header />
				<div className="card">
					<div className="filters">
						<label>
							Start date
							<input
								type="date"
								value={startDate}
								onChange={(event) => setStartDate(event.target.value)}
							/>
						</label>
						<label>
							End date
							<input
								type="date"
								value={endDate}
								onChange={(event) => setEndDate(event.target.value)}
							/>
						</label>
						<label>
							Event category
							<input
								type="text"
								placeholder="Filter by category"
								value={eventFilter}
								onChange={(event) => setEventFilter(event.target.value)}
							/>
						</label>
						<button
							type="button"
							onClick={() => {
								setStartDate(DEFAULT_START);
								setEndDate(DEFAULT_END);
								setEventFilter("");
							}}
						>
							Reset filters
						</button>
					</div>
				</div>

				{loading ? (
					<LoadingSpinner />
				) : (
					<div className="grid" style={{ marginTop: "24px" }}>
						<TimeSeriesChart
							prices={prices}
							events={filteredEvents}
							changePoint={changePoint}
						/>
						<div className="grid grid-2">
							<ChangePointChart changePoint={changePoint} />
							<Sidebar stats={stats} changePoint={changePoint} />
						</div>
						<ImpactAnalysis stats={stats} />
						<EventTimeline events={filteredEvents} onSelect={handleEventSelect} />
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default Dashboard;
