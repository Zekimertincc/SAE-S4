from features.visitors.visitors_service import VisitorService
from flask import Blueprint, request, jsonify, current_app

visitors_bp = Blueprint("visitors", __name__)


def get_service():
    return VisitorService(current_app.db)


@visitors_bp.route("/api/visitors", methods=["POST"])
def post_visitor():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    required = ["first_name", "last_name", "email", "bac_type", "department"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Champs manquants : {', '.join(missing)}"}), 400

    result, status = get_service().create(data)
    return jsonify(result), status


@visitors_bp.route("/api/visitors", methods=["GET"])
def list_visitors():
    result = get_service().get_all(request.args)
    return jsonify(result), 200


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["GET"])
def get_visitor(visitor_id):
    visitor = get_service().get_by_id(visitor_id)
    if not visitor:
        return jsonify({"error": "Visiteur introuvable"}), 404
    return jsonify(visitor), 200


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["PUT"])
def put_visitor(visitor_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400
    visitor = get_service().update(visitor_id, data)
    if not visitor:
        return jsonify({"error": "Visiteur introuvable"}), 404
    return jsonify(visitor), 200


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["DELETE"])
def del_visitor(visitor_id):
    success = get_service().delete(visitor_id)
    if not success:
        return jsonify({"error": "Visiteur introuvable"}), 404
    return jsonify({"message": "Visiteur supprimé"}), 200