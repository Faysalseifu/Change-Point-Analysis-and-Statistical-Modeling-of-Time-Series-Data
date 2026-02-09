import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "/api";

const client = axios.create({
	baseURL: API_BASE,
	timeout: 15000,
});

export const fetchPrices = async (start, end) => {
	const params = {};
	if (start) params.start = start;
	if (end) params.end = end;
	const response = await client.get("/prices", { params });
	return response.data;
};

export const fetchEvents = async () => {
	const response = await client.get("/events");
	return response.data;
};

export const fetchChangePoints = async () => {
	const response = await client.get("/change_points");
	return response.data;
};

export const fetchStats = async () => {
	const response = await client.get("/stats");
	return response.data;
};
