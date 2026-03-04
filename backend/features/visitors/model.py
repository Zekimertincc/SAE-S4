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
