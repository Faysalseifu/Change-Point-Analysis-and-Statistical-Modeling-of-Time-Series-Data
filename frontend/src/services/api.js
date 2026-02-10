import axios from "axios";

const FALLBACK_BASE = "http://127.0.0.1:5000/api";
const resolveBase = () => {
	if (process.env.REACT_APP_API_BASE_URL) {
		return process.env.REACT_APP_API_BASE_URL;
	}
	if (typeof window !== "undefined" && window.location?.protocol === "file:") {
		return FALLBACK_BASE;
	}
	return "/api";
};

const API_BASE = resolveBase();

const client = axios.create({
	baseURL: API_BASE,
	timeout: 15000,
});

const fallbackClient = axios.create({
	baseURL: FALLBACK_BASE,
	timeout: 15000,
});

const requestWithFallback = async (path, params) => {
	try {
		const response = await client.get(path, { params });
		return response.data;
	} catch (error) {
		if (API_BASE !== "/api") {
			throw error;
		}
		const response = await fallbackClient.get(path, { params });
		return response.data;
	}
};

export const fetchPrices = async (start, end) => {
	const params = {};
	if (start) params.start = start;
	if (end) params.end = end;
	return requestWithFallback("/prices", params);
};

export const fetchEvents = async () => {
	return requestWithFallback("/events");
};

export const fetchChangePoints = async () => {
	return requestWithFallback("/change_points");
};

export const fetchStats = async () => {
	return requestWithFallback("/stats");
};

export const fetchHealth = async () => {
	return requestWithFallback("/health");
};
