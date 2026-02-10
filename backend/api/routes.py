from flask import Blueprint, jsonify, request

from services.analysis_service import (
	get_change_points,
	get_events,
	get_key_stats,
	get_prices_in_range,
)

api = Blueprint("api", __name__, url_prefix="/api")


@api.route("/health", methods=["GET"])
def health():
	return jsonify({"status": "ok"})


@api.route("/prices", methods=["GET"])
def prices():
	start = request.args.get("start")
	end = request.args.get("end")
	records = get_prices_in_range(start, end)
	return jsonify(records)


@api.route("/events", methods=["GET"])
def events():
	records = get_events()
	return jsonify(records)


@api.route("/change_points", methods=["GET"])
def change_points():
	payload = get_change_points()
	return jsonify(payload)


@api.route("/stats", methods=["GET"])
def stats():
	payload = get_key_stats()
	return jsonify(payload)
