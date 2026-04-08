from flask import Flask
from flask_cors import CORS
from core.database import init_db
from features.visitors.visitors_routes import visitors_bp
from features.auth.auth_routes import auth_bp
from features.stats.routes import stats_bp
from features.managers.managers_routes import managers_bp


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/sae_jpo"
app.config["JSON_ENSURE_ASCII"] = False
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

init_db(app)

app.register_blueprint(visitors_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(managers_bp)


@app.route("/")
def index():
    return {"message": "API opérationnelle"}, 200

if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)