from flask import Blueprint, jsonify, current_app
from features.stats.service import StatsService
from core.auth_middleware import require_auth

stats_bp = Blueprint("stats", __name__)

def get_service():
    return StatsService(current_app.db)

@stats_bp.route("/api/stats/total", methods=["GET"])
@require_auth
def get_total():
    return jsonify(get_service().get_total()), 200

@stats_bp.route("/api/stats/department", methods=["GET"])
@require_auth
def get_by_department():
    return jsonify(get_service().get_by_department()), 200

@stats_bp.route("/api/stats/visitors", methods=["GET"])
@require_auth
def get_by_bac():
    return jsonify(get_service().get_by_bac_type()), 200
