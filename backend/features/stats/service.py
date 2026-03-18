class StatsService:
    def __init__(self, db):
        self.collection = db['visitors']

    def get_total(self):
        return {"total_visitors": self.collection.count_documents({})}

    def get_by_department(self):
        query = [{"$group": {"_id": "$department", "count": {"$sum": 1}}}]
        resultats = self.collection.aggregate(query)
        return {"by_department": [{"department": r["_id"], "count": r["count"]} for r in resultats]}

    def get_by_bac_type(self):
        query = [{"$group": {"_id": "$bac_type", "count": {"$sum": 1}}}]
        resultats = self.collection.aggregate(query)
        return {"by_bac_type": [{"bac_type": r["_id"], "count": r["count"]} for r in resultats]}