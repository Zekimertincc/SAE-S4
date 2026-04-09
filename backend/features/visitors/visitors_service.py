from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from features.visitors.visitors_model import Visitor


class VisitorService:
    def __init__(self, db):
        self.col = db["visitors"]

    def create(self, data: dict) -> tuple:
        existing = self.col.find_one({
            "email": data.get("email", "").strip().lower(),
            "department": data.get("department", "")
        })

        if existing:
            self.col.update_one(
                {"_id": existing["_id"]},
                {"$inc": {"visit_count": 1}}
            )
            updated = self.col.find_one({"_id": existing["_id"]})
            return Visitor.serialize(updated), 200

        visitor = Visitor.from_dict(data)
        result = self.col.insert_one(visitor.to_dict())
        doc = self.col.find_one({"_id": result.inserted_id})
        return Visitor.serialize(doc), 201

    def get_all(self, filters: dict) -> dict:
        query = {}

        if filters.get("department"):
            query["department"] = filters["department"]

        if filters.get("bac_type"):
            query["bac_type"] = filters["bac_type"]

        if filters.get("reorientation") in ("true", "false"):
            query["reorientation"] = filters["reorientation"] == "true"

        if filters.get("dossier_particulier"):
            query["dossier_particulier"] = filters["dossier_particulier"] == "true"

        if filters.get("immersion"):
            query["immersion"] = filters["immersion"] == "true"

        if filters.get("etablissement"):
            query["etablissement"] = filters["etablissement"]

        if filters.get("ville"):
            query["ville"] = filters["ville"]

        if filters.get("specialite_1"):
            query["specialite_1"] = filters["specialite_1"]

        if filters.get("specialite_2"):
            query["specialite_2"] = filters["specialite_2"]

        if filters.get("search"):
            terme = filters["search"].strip()
            regex = {"$regex": terme, "$options": "i"}
            query["$or"] = [
                {"first_name": regex},
                {"last_name": regex},
                {"email": regex},
                {"ine": regex},
            ]

        if filters.get("date"):
            try:
                d = datetime.strptime(filters["date"], "%Y-%m-%d")
                query["created_at"] = {
                    "$gte": d.replace(hour=0, minute=0, second=0),
                    "$lte": d.replace(hour=23, minute=59, second=59),
                }
            except ValueError:
                pass

        page = int(filters.get("page", 1))
        limit = int(filters.get("limit", 10))
        skip = (page - 1) * limit

        sort_field = filters.get("sort", "created_at")
        sort_order = -1 if filters.get("order", "desc") == "desc" else 1

        total = self.col.count_documents(query)
        docs = self.col.find(query).sort(sort_field, sort_order).skip(skip).limit(limit)

        return {
            "data": [Visitor.serialize(d) for d in docs],
            "pagination": {"page": page, "limit": limit, "total": total}
        }

    def get_by_id(self, visitor_id: str) -> dict | None:
        try:
            doc = self.col.find_one({"_id": ObjectId(visitor_id)})
            return Visitor.serialize(doc)
        except InvalidId:
            return None

    def update(self, visitor_id: str, data: dict) -> dict | None:
        try:
            self.col.update_one(
                {"_id": ObjectId(visitor_id)},
                {"$set": data}
            )
            doc = self.col.find_one({"_id": ObjectId(visitor_id)})
            return Visitor.serialize(doc)
        except InvalidId:
            return None

    def delete(self, visitor_id: str) -> bool:
        try:
            result = self.col.delete_one({"_id": ObjectId(visitor_id)})
            return result.deleted_count == 1
        except InvalidId:
            return False
