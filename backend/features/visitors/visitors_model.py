from datetime import datetime


class Visitor:
    """
    Représente un visiteur de la JPO.
    Contient la structure des données et les méthodes de conversion.
    """

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
        specialite_1: str = None,
        specialite_2: str = None,
        etablissement: str = None,
        ville: str = None,
        immersion: bool = False,
    ):
        self.first_name = first_name.strip()
        self.last_name = last_name.strip()
        self.email = email.strip().lower()
        self.bac_type = bac_type
        self.department = department
        self.ine = ine
        self.reorientation = reorientation
        self.dossier_particulier = dossier_particulier
        self.specialite_1 = specialite_1
        self.specialite_2 = specialite_2
        self.etablissement = etablissement
        self.ville = ville
        self.immersion = immersion
        self.created_at = datetime.now()
        self.visit_count = 1

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
            "specialite_1": self.specialite_1,
            "specialite_2": self.specialite_2,
            "etablissement": self.etablissement,
            "ville": self.ville,
            "immersion": self.immersion,
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
            specialite_1=data.get("specialite_1", None),
            specialite_2=data.get("specialite_2", None),
            etablissement=data.get("etablissement", None),
            ville=data.get("ville", None),
            immersion=bool(data.get("immersion", False)),
        )

    @staticmethod
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
            "specialite_1": doc.get("specialite_1"),
            "specialite_2": doc.get("specialite_2"),
            "etablissement": doc.get("etablissement"),
            "ville": doc.get("ville"),
            "immersion": doc.get("immersion", False),
            "created_at": doc.get("created_at", datetime.utcnow()).isoformat(),
            "visit_count": doc.get("visit_count", 1),
        }