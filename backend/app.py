from flask import Flask
from core.database import init_db

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/sae_jpo"

init_db(app)

@app.route("/")
def index():
    return {"message": "API opérationnelle"}, 200

if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)