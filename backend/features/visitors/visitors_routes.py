import csv
import io
from core.auth_middleware import require_auth
from features.visitors.visitors_service import VisitorService
from flask import Blueprint, request, jsonify, current_app, Response

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
@require_auth
def list_visitors():
    result = get_service().get_all(request.args)
    return jsonify(result), 200


@visitors_bp.route("/api/visitors/export", methods=["GET"])
def export_visitors():
    from core.auth_middleware import AuthMiddleware
    from datetime import datetime
    auth_header = request.headers.get("Authorization", "")
    token_from_query = request.args.get("token", "")
    token = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else token_from_query
    if not token or AuthMiddleware.verify_token(token) is None:
        return jsonify({"error": "Token manquant ou invalide"}), 401

    db = current_app.db
    query = {}

    dep = request.args.get("department")
    bac = request.args.get("bac_type")
    reo = request.args.get("reorientation")
    search = request.args.get("search")
    date = request.args.get("date")

    if dep:
        query["department"] = dep
    if bac:
        query["bac_type"] = bac
    if reo in ("true", "false"):
        query["reorientation"] = (reo.lower() == "true")
    if search:
        terme = search.strip()
        regex = {"$regex": terme, "$options": "i"}
        query["$or"] = [
            {"first_name": regex},
            {"last_name": regex},
            {"email": regex},
            {"ine": regex},
        ]
    if date:
        try:
            d = datetime.strptime(date, "%Y-%m-%d")
            query["created_at"] = {
                "$gte": d.replace(hour=0, minute=0, second=0),
                "$lte": d.replace(hour=23, minute=59, second=59),
            }
        except ValueError:
            pass

    visitors = list(db.visitors.find(query))
    output = io.StringIO()
    writer = csv.writer(output)

    fields_arg = request.args.get("fields")
    columns = fields_arg.split(",") if fields_arg else ["first_name", "last_name", "email", "department", "bac_type", "reorientation", "ine", "created_at"]
    writer.writerow(columns)

    for v in visitors:
        writer.writerow([v.get(col, "") for col in columns])

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=export.csv"}
    )


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["GET"])
@require_auth
def get_visitor(visitor_id):
    visitor = get_service().get_by_id(visitor_id)
    if not visitor:
        return jsonify({"error": "Visiteur introuvable"}), 404
    return jsonify(visitor), 200


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["PUT"])
@require_auth
def put_visitor(visitor_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400
    visitor = get_service().update(visitor_id, data)
    if not visitor:
        return jsonify({"error": "Visiteur introuvable"}), 404
    return jsonify(visitor), 200


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["DELETE"])
@require_auth
def del_visitor(visitor_id):
    success = get_service().delete(visitor_id)
    if not success:
        return jsonify({"error": "Visiteur introuvable"}), 404
    return jsonify({"message": "Visiteur supprimé"}), 200
