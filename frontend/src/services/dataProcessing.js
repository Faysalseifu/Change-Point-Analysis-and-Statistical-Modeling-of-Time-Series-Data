import { format } from "date-fns";

export const formatDate = (value) => {
	if (!value) return "";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return "";
	}
	return format(parsed, "yyyy-MM-dd");
};

export const normalizePriceSeries = (records) =>
	(records || [])
		.map((row) => ({
			date: formatDate(row.Date || row.date),
			price: Number(row.Price ?? row.price),
		}))
		.filter((row) => row.date && Number.isFinite(row.price));

export const normalizeEvents = (records) =>
	(records || [])
		.map((row) => ({
			date: formatDate(row.Date || row.date),
			title: row.Event_Description || row.title || "",
			category: row.Category || row.category || "",
		}))
		.filter((row) => row.date && row.title);

export const inRange = (value, start, end) => {
	if (!value) return false;
	const current = new Date(value).getTime();
	const startMs = start ? new Date(start).getTime() : null;
	const endMs = end ? new Date(end).getTime() : null;
	if (Number.isNaN(current)) return false;
	if (startMs && current < startMs) return false;
	if (endMs && current > endMs) return false;
	return true;
};
