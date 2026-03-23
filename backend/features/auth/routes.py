from flask import Blueprint, request, jsonify
from features.auth.service import AuthService

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth", methods=["POST"])
def login():
    data = request.get_json()
    if AuthService().check_password(data.get("password", "")):
        return jsonify({"success": True}), 200
    return jsonify({"error": "Mot de passe incorrect"}), 401