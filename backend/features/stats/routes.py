from flask import Blueprint, jsonify, current_app
from features.stats.service import StatsService

stats_bp = Blueprint("stats", __name__)


def get_service():
    return StatsService(current_app.db)


@stats_bp.route("/api/stats/total", methods=["GET"])
def get_total():
    return jsonify(get_service().get_total()), 200


@stats_bp.route("/api/stats/department", methods=["GET"])
def get_by_department():
    return jsonify(get_service().get_by_department()), 200


@stats_bp.route("/api/stats/bac_type", methods=["GET"])
def get_by_bac_type():
    return jsonify(get_service().get_by_bac_type()), 200


@stats_bp.route("/api/stats/date", methods=["GET"])
def get_by_date():
    return jsonify(get_service().get_by_date()), 200
