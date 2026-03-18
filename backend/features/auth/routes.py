import jwt
import datetime
from flask import Blueprint, request, jsonify
from config import Config
from core.auth_middleware import require_auth

auth_bp = Blueprint("auth", __name__)


class AuthService:
    @staticmethod
    def generate_token(email: str) -> str:
        payload = {
            "sub": email,
            "iat": datetime.datetime.now(),
            "exp": datetime.datetime.now() + datetime.timedelta(hours=8),
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def check_credentials(email: str, password: str) -> bool:
        return (
            email == Config.MANAGER_EMAIL.lower() and
            password == Config.MANAGER_PASSWORD
        )


@auth_bp.route("/api/auth", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    if not AuthService.check_credentials(email, password):
        return jsonify({"error": "Identifiants invalides"}), 401

    token = AuthService.generate_token(email)
    return jsonify({"token": token, "email": email}), 200


@auth_bp.route("/api/admin/password", methods=["PUT"])
@require_auth
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    new_password = data.get("new_password", "").strip()
    if len(new_password) < 6:
        return jsonify({"error": "Mot de passe trop court (6 caractères minimum)"}), 400

    Config.MANAGER_PASSWORD = new_password
    return jsonify({"message": "Mot de passe modifié avec succès"}), 200