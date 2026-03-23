from flask import Blueprint, jsonify, current_app
from features.stats.service import StatsService

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/api/stats/total", methods=["GET"])
def stats_total():
    return jsonify(StatsService(current_app.db).get_total()), 200

@stats_bp.route("/api/stats/department", methods=["GET"])
def stats_department():
    return jsonify(StatsService(current_app.db).get_by_department()), 200

@stats_bp.route("/api/stats/visitors", methods=["GET"])
def stats_visitors():
    return jsonify(StatsService(current_app.db).get_by_bac_type()), 200