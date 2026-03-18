import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app
from config import Config
from core.auth_middleware import require_auth
from core.security import Security
from features.managers.managers_service import ManagerService

auth_bp = Blueprint("auth", __name__)


def get_service():
    return ManagerService(current_app.db)


class AuthService:
    @staticmethod
    def generate_token(email: str) -> str:
        payload = {
            "sub": email,
            "exp": datetime.datetime.now() + datetime.timedelta(hours=8),
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")


@auth_bp.route("/api/auth", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    manager = get_service().find_by_email(email)
    if not manager:
        return jsonify({"error": "Identifiants invalides"}), 401

    if not Security.check_password(password, manager["password"]):
        return jsonify({"error": "Identifiants invalides"}), 401

    token = AuthService.generate_token(email)
    return jsonify({
        "token": token,
        "email": email,
        "name": manager.get("name", ""),
        "role": manager.get("role", "")
    }), 200


@auth_bp.route("/api/admin/password", methods=["PUT"])
@require_auth
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    email = data.get("email", "").strip().lower()
    new_password = data.get("new_password", "").strip()

    if len(new_password) < 6:
        return jsonify({"error": "Mot de passe trop court (6 caractères minimum)"}), 400

    result = get_service().update_password(email, new_password)
    if not result:
        return jsonify({"error": "Gestionnaire introuvable"}), 404
    return jsonify(result), 200