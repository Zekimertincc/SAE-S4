from datetime import datetime


class Visitor:
    def __init__(
            self,
            first_name: str,
            last_name: str,
            email: str,
            bac_type: str,
            department: str,
            ine: str = None,
            reorientation: bool = False,
            dossier_particulier: bool = False,
    ):
        self.first_name = first_name.strip()
        self.last_name = last_name.strip()
        self.email = email.strip().lower()
        self.bac_type = bac_type
        self.department = department
        self.ine = ine
        self.reorientation = reorientation
        self.dossier_particulier = dossier_particulier
        self.created_at = datetime.now()
        self.visit_count = 1

    # convertit l'objet en doc -> lus par mongo
    def to_dict(self) -> dict:
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "bac_type": self.bac_type,
            "department": self.department,
            "ine": self.ine,
            "reorientation": self.reorientation,
            "dossier_particulier": self.dossier_particulier,
            "created_at": self.created_at,
            "visit_count": self.visit_count,
        }

    @staticmethod
    def from_dict(data: dict) -> "Visitor":
        return Visitor(
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=data.get("email", ""),
            bac_type=data.get("bac_type", ""),
            department=data.get("department", ""),
            ine=data.get("ine", None),
            reorientation=bool(data.get("reorientation", False)),
            dossier_particulier=bool(data.get("dossier_particulier", False)),
        )

    @staticmethod # convertit le doc mongo en dict json -> objectId pas lisible en json
    def serialize(doc: dict) -> dict | None:
        if doc is None:
            return None
        return {
            "id": str(doc["_id"]),
            "first_name": doc.get("first_name", ""),
            "last_name": doc.get("last_name", ""),
            "email": doc.get("email", ""),
            "bac_type": doc.get("bac_type", ""),
            "department": doc.get("department", ""),
            "ine": doc.get("ine"),
            "reorientation": doc.get("reorientation", False),
            "dossier_particulier": doc.get("dossier_particulier", False),
            "created_at": doc.get("created_at", datetime.now()).isoformat(),
            "visit_count": doc.get("visit_count", 1),
        }