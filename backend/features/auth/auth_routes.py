from flask import Blueprint, request, jsonify, current_app
from core.auth_middleware import require_auth
from features.auth.auth_service import AuthService

auth_bp = Blueprint("auth", __name__)


def get_service():
    return AuthService(current_app.db)

@auth_bp.route("/api/auth", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    password = data.get("password", "")
    if not password:
        return jsonify({"error": "Mot de passe requis"}), 400

    result, status = get_service().login(password)
    return jsonify(result), status


@auth_bp.route("/api/auth/me", methods=["GET"])
@require_auth
def get_me():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    manager = get_service().get_current_user(token)
    if not manager:
        return jsonify({"error": "Gestionnaire introuvable"}), 404
    return jsonify(manager), 200


@auth_bp.route("/api/admin/password", methods=["PUT"])
@require_auth
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    new_password = data.get("new_password", "").strip()
    if len(new_password) < 6:
        return jsonify({"error": "Mot de passe trop court (6 caractères minimum)"}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    email = AuthService.get_email_from_token(token)
    if not email:
        return jsonify({"error": "Token invalide"}), 401

    from features.managers.managers_service import ManagerService
    result = ManagerService(current_app.db).update_password(email, new_password)
    if not result:
        return jsonify({"error": "Gestionnaire introuvable"}), 404
    return jsonify(result), 200