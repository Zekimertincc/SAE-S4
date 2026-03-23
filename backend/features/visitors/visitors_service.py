import csv, io
from bson import ObjectId
from bson.errors import InvalidId
from .visitors_model import Visitor


class VisitorService:
    def __init__(self, bd):
        self.collection = bd['visitors']

    def get_by_id(self, visitor_id: str) -> dict | None:
        try:
            doc = self.collection.find_one({"_id": ObjectId(visitor_id)})
            return Visitor.serialize(doc)
        except InvalidId:
            return None

    def create(self, data: dict) -> tuple:
        existing_visitor = self.collection.find_one({
            "email": data.get("email", "").strip().lower(),
            "department": data.get("department", "")
        })

        if existing_visitor:
            self.collection.update_one(
                {'_id': existing_visitor['_id']},
                {'$inc': {'visit_count': 1}}
            )
            updated_visitor = self.collection.find_one({'_id': existing_visitor['_id']})
            return Visitor.serialize(updated_visitor), 200

        visitor = Visitor.from_dict(data)
        result = self.collection.insert_one(visitor.to_dict())
        doc = self.collection.find_one({"_id": result.inserted_id})
        return Visitor.serialize(doc), 201

    def delete(self, visitor_id: str) -> bool:
        try:
            result = self.collection.delete_one({"_id": ObjectId(visitor_id)})
            return result.deleted_count == 1
        except InvalidId:
            return False

    def update(self, visitor_id: str, data: dict) -> dict | None:
        try:
            self.collection.update_one(
                {"_id": ObjectId(visitor_id)},
                {"$set": data}
            )
            doc = self.collection.find_one({"_id": ObjectId(visitor_id)})
            return Visitor.serialize(doc)
        except InvalidId:
            return None

    def get_all(self, filters: dict) -> dict:
        query = {}

        if filters.get("department"):
            query["department"] = filters["department"]
        if filters.get("bac_type"):
            query["bac_type"] = filters["bac_type"]
        if filters.get("reorientation"):
            query["reorientation"] = filters["reorientation"] == "true"

        page = int(filters.get("page", 1))
        limit = int(filters.get("limit", 10))
        skip = (page - 1) * limit

        sort_field = filters.get("sort", "created_at")
        sort_order = -1 if filters.get("order", "desc") == "desc" else 1

        total = self.collection.count_documents(query)
        docs = self.collection.find(query).sort(sort_field, sort_order).skip(skip).limit(limit)

        return {
            "data": [Visitor.serialize(d) for d in docs],
            "pagination": {"page": page, "limit": limit, "total": total}
        }
    
    def export_csv(self, fields=None):
        
        all_fields = ["id", "first_name", "last_name", "email", "bac_type", "department", "ine", "reorientation", "created_at"]
        selected = [f for f in fields.split(",") if f in all_fields] if fields else all_fields
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=selected, extrasaction="ignore")
        writer.writeheader()
        for doc in self.collection.find({}):
            row = Visitor.serialize(doc)
            writer.writerow({k: row.get(k, "") for k in selected})
        return output.getvalue()