from flask import current_app

class AuthService:
    def check_password(self, password):
        return password == current_app.config.get("MANAGER_PASSWORD", "admin123")