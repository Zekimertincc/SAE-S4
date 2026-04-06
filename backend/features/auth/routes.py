from flask import Blueprint, request, jsonify, current_app
from features.auth.service import AuthService

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth", methods=["POST"])
def login():
    data = request.get_json()
    if AuthService().check_password(data.get("password", "")):
        return jsonify({"success": True}), 200
    return jsonify({"error": "Mot de passe incorrect"}), 401

@auth_bp.route("/api/admin/password", methods=["PUT"])
def change_password():
    data = request.get_json()
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not AuthService().check_password(current_password):
        return jsonify({"error": "Mot de passe actuel incorrect"}), 401
    if not new_password or len(new_password) < 4:
        return jsonify({"error": "Le nouveau mot de passe doit contenir au moins 4 caractères"}), 400

    current_app.config["MANAGER_PASSWORD"] = new_password
    return jsonify({"success": True}), 200