import jwt
import bcrypt
import datetime
from flask import Blueprint, request, jsonify, current_app
from config import Config
from core.auth_middleware import require_auth

auth_bp = Blueprint("auth", __name__)

class AuthService:
    @staticmethod
    def generate_token(email: str) -> str:
        payload = {
            "sub": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8),
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def find_manager(db, email: str) -> dict | None:
        return db["managers"].find_one({"email": email.strip().lower()})

    @staticmethod
    def check_password(plain: str, hashed: str) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

@auth_bp.route("/api/auth", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    manager = AuthService.find_manager(current_app.db, email)
    if not manager:
        return jsonify({"error": "Identifiants invalides"}), 401

    if not AuthService.check_password(password, manager["password"]):
        return jsonify({"error": "Identifiants invalides"}), 401

    token = AuthService.generate_token(email)

    return jsonify({
        "token": token,
        "email": email,
        "name": manager.get("name", "")
    }), 200


@auth_bp.route("/api/admin/password", methods=["PUT"])
@require_auth
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split(" ")[1]
    payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
    email = payload.get("sub")

    new_password = data.get("new_password", "").strip()
    if len(new_password) < 6:
        return jsonify({"error": "Mot de passe trop court (6 caractères minimum)"}), 400

    hashed = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    current_app.db["managers"].update_one(
        {"email": email},
        {"$set": {"password": hashed}}
    )
    return jsonify({"message": "Mot de passe modifié avec succès"}), 200