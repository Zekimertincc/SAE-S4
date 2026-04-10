from flask import Blueprint, request, jsonify, current_app
from features.managers.managers_service import ManagerService
from features.auth.service import AuthService
from core.auth_middleware import require_auth

managers_bp = Blueprint("managers", __name__)


def get_service():
    return ManagerService(current_app.db)

def is_admin():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    return AuthService(current_app.db).is_admin(token)


@managers_bp.route("/api/managers", methods=["GET"])
@require_auth
def list_managers():
    managers = get_service().get_all()
    return jsonify(managers), 200


@managers_bp.route("/api/managers", methods=["POST"])
@require_auth
def create_manager():
    if not is_admin():
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    required = ["email", "password", "name"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Champs manquants : {', '.join(missing)}"}), 400

    if len(data.get("password", "")) < 6:
        return jsonify({"error": "Mot de passe trop court (6 caractères minimum)"}), 400

    result, status = get_service().create(data)
    return jsonify(result), status


@managers_bp.route("/api/managers/<manager_id>", methods=["PUT"])
@require_auth
def update_manager(manager_id):
    if not is_admin():
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    result = get_service().update(manager_id, data)
    if not result:
        return jsonify({"error": "Gestionnaire introuvable"}), 404
    return jsonify(result), 200


@managers_bp.route("/api/managers/<manager_id>", methods=["DELETE"])
@require_auth
def delete_manager(manager_id):
    if not is_admin():
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    success = get_service().delete(manager_id)
    if not success:
        return jsonify({"error": "Gestionnaire introuvable"}), 404
    return jsonify({"message": "Gestionnaire supprimé"}), 200
