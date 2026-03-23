class StatsService:
    def __init__(self, db):
        self.collection = db["visitors"]

    def get_total(self):
        return {"total_visitors": self.collection.count_documents({})}

    def get_by_department(self):
        pipeline = [{"$group": {"_id": "$department", "count": {"$sum": 1}}}]
        return {"by_department": [{"department": r["_id"], "count": r["count"]} for r in self.collection.aggregate(pipeline)]}

    def get_by_bac_type(self):
        pipeline = [{"$group": {"_id": "$bac_type", "count": {"$sum": 1}}}]
        return {"by_bac_type": [{"bac_type": r["_id"], "count": r["count"]} for r in self.collection.aggregate(pipeline)]}