import csv
import io
from core.auth_middleware import require_auth
from features.visitors.visitors_service import VisitorService
from flask import Blueprint, request, jsonify, current_app, Response

visitors_bp = Blueprint("visitors", __name__)


def get_service():
    return VisitorService(current_app.db)


@visitors_bp.route("/api/visitors/export", methods=['GET', 'OPTIONS'])
def export_visitors():
    if request.method == 'OPTIONS':
        return Response(status=200)

    db = current_app.db
    query = {}

    dep = request.args.get('department')
    bac = request.args.get('bac_type')
    reo = request.args.get('reorientation')
    search = request.args.get('search')

    if dep: query['department'] = dep
    if bac: query['bac_type'] = bac
    if reo: query['reorientation'] = (reo.lower() == 'true')
    if search:
        query['$or'] = [
            {'first_name': {'$regex': search, '$options': 'i'}},
            {'last_name': {'$regex': search, '$options': 'i'}}
        ]

    visitors = list(db.visitors.find(query))
    output = io.StringIO()
    writer = csv.writer(output)

    # On passe directement à l'en-tête des colonnes
    fields_arg = request.args.get('fields')
    columns = fields_arg.split(',') if fields_arg else ['first_name', 'last_name', 'email', 'department', 'created_at']
    writer.writerow(columns)

    for v in visitors:
        writer.writerow([v.get(col, '') for col in columns])

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=export.csv"}
    )


@visitors_bp.route("/api/visitors", methods=["GET", "OPTIONS"])
def list_visitors():
    if request.method == 'OPTIONS':
        return Response(status=200)

    @require_auth
    def protected_list():
        resultat = get_service().get_all(request.args)
        return jsonify(resultat), 200

    return protected_list()


@visitors_bp.route("/api/visitors", methods=["POST", "OPTIONS"])
def post_visitor():
    if request.method == 'OPTIONS':
        return Response(status=200)

    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    required = ["first_name", "last_name", "email", "bac_type", "department"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Champs manquants : {', '.join(missing)}"}), 400

    result, status = get_service().create(data)
    return jsonify(result), status


@visitors_bp.route("/api/visitors/<visitor_id>", methods=["GET", "PUT", "DELETE", "OPTIONS"])
def manage_visitor(visitor_id):
    if request.method == 'OPTIONS':
        return Response(status=200)

    @require_auth
    def protected_manage(v_id):
        service = get_service()

        if request.method == "GET":
            v = service.get_by_id(v_id)
            if not v:
                return jsonify({"error": "Visiteur introuvable"}), 404
            return jsonify(v), 200

        if request.method == "PUT":
            data = request.get_json()
            if not data:
                return jsonify({"error": "Corps JSON requis"}), 400
            v = service.update(v_id, data)
            if not v:
                return jsonify({"error": "Visiteur introuvable"}), 404
            return jsonify(v), 200

        if request.method == "DELETE":
            success = service.delete(v_id)
            if not success:
                return jsonify({"error": "Visiteur introuvable"}), 404
            return jsonify({"message": "Visiteur supprimé"}), 200

    return protected_manage(visitor_id)