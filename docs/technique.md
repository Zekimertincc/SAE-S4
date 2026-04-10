# Documentation Technique
**Application JPO IUT — Gestion des visiteurs**
SAE S4 — IUT de Montreuil — 2025–2026
*Camillia · Zeki · Sergio*

---

## 1. Architecture générale

L'application JPO IUT est une SPA (Single Page Application) composée de trois couches :

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Flask (Python 3) + PyJWT + bcrypt |
| Base de données | MongoDB 8 (NoSQL) |
| Communication | API REST JSON + CORS |

### 1.1 Frontend

- React 19 avec TypeScript strict
- Vite comme bundler (HMR, ESM natif)
- React Router v7 pour la navigation SPA
- Zod pour la validation des formulaires côté client
- Recharts pour les graphiques de statistiques
- Tailwind CSS v4 pour le style
- DM Sans comme police principale

### 1.2 Backend

- Flask avec architecture en Blueprints (visitors, auth, stats, managers)
- PyJWT pour la génération et vérification des tokens JWT
- bcrypt pour le hachage sécurisé des mots de passe
- PyMongo pour la communication avec MongoDB
- Flask-CORS pour autoriser les requêtes cross-origin

### 1.3 Base de données

- MongoDB avec une collection `visitors`
- Index TTL de 120 jours pour la suppression automatique (RGPD)
- Index texte sur prénom, nom, email, INE pour la recherche

---

## 2. Structure du projet

### 2.1 Arborescence backend

```
backend/
  app.py              # Point d'entrée Flask
  config.py           # Variables d'environnement
  requirements.txt    # Dépendances Python
  core/
    database.py       # Initialisation MongoDB
    auth_middleware.py # Décorateur @require_auth
  features/
    visitors/         # CRUD visiteurs + export CSV
    auth/             # Login / token JWT
    stats/            # Statistiques agrégées
    managers/         # Gestion des admins
```

### 2.2 Arborescence frontend

```
frontend/src/
  main.tsx            # Point d'entrée React
  App.tsx             # Router principal
  theme.ts            # Couleurs et polices
  api/api.ts          # Toutes les fonctions fetch
  pages/
    VisitorForm.tsx   # Formulaire d'inscription visiteur
    Admin.tsx         # Tableau de bord admin
    Confirmation.tsx  # Page post-inscription + avis
  components/
    LoginForm.tsx     # Connexion admin
    AdminHeader.tsx   # Barre de navigation admin
    TabBar.tsx        # Onglets (Stats/Visiteurs/Avis/Param)
    StatsTab.tsx      # Onglet statistiques
    VisitorTab.tsx    # Liste + filtres + pagination
    AvisTab.tsx       # Onglet avis/feedbacks
    SettingsTab.tsx   # Paramètres
    ConsentModal.tsx  # Modal RGPD
```

---

## 3. Endpoints API REST

| Méthode + Route | Auth | Description |
|---|---|---|
| `POST /api/auth/login` | Non | Connexion avec mot de passe unique → retourne JWT |
| `GET /api/visitors` | Oui | Liste paginée des visiteurs |
| `POST /api/visitors` | Non | Enregistrement d'un nouveau visiteur |
| `GET /api/visitors/{id}` | Oui | Détail d'un visiteur |
| `PUT /api/visitors/{id}` | Oui | Mise à jour d'un visiteur |
| `DELETE /api/visitors/{id}` | Oui | Suppression d'un visiteur |
| `DELETE /api/visitors` | Oui | Suppression de tous les visiteurs |
| `POST /api/visitors/{id}/feedback` | Non | Enregistrement de l'avis |
| `GET /api/visitors/export` | Token URL | Export CSV avec filtres |
| `GET /api/stats/total` | Non | Nombre total de visiteurs |
| `GET /api/stats/department` | Non | Répartition par département |
| `GET /api/stats/bac_type` | Non | Répartition par type de bac |
| `GET /api/stats/date` | Non | Inscriptions par jour |
| `GET /api/managers` | Oui | Liste des managers |
| `POST /api/managers` | Oui | Création d'un manager |

### 3.1 Paramètres de filtrage (`GET /api/visitors`)

| Paramètre | Description |
|---|---|
| `page` | Numéro de page (défaut : 1) |
| `limit` | Nombre d'éléments par page (défaut : 15) |
| `department` | Filtre par département IUT |
| `bac_type` | Filtre par type de bac |
| `reorientation` | `true` / `false` |
| `immersion` | `true` / `false` |
| `dossier_particulier` | `true` / `false` |
| `date` | Filtre par date au format `YYYY-MM-DD` |
| `search` | Recherche texte (prénom, nom, email, INE) |

---

## 4. Modèle de données

### 4.1 Collection `visitors`

| Champ | Description |
|---|---|
| `_id` | ObjectId MongoDB (généré automatiquement) |
| `first_name` | Prénom du visiteur |
| `last_name` | Nom du visiteur |
| `email` | Adresse email |
| `bac_type` | Type de bac (Général, STI2D, STL, Pro…) |
| `department` | Département IUT souhaité |
| `reorientation` | Booléen : en réorientation ? |
| `immersion` | Booléen : souhaite une immersion ? |
| `dossier_particulier` | Booléen : dossier particulier (handicap, haut niveau…) |
| `ine` | Identifiant national étudiant (optionnel) |
| `etablissement` | Lycée d'origine (optionnel) |
| `ville` | Ville (optionnel) |
| `specialite_1` | Première spécialité (optionnel) |
| `specialite_2` | Deuxième spécialité (optionnel) |
| `rgpd_consent` | Booléen : consentement RGPD accepté |
| `rating` | Note 1–5 (donnée après inscription) |
| `comment` | Commentaire libre (optionnel) |
| `heard_from` | Comment le visiteur a entendu parler de la JPO |
| `created_at` | Date d'inscription (UTC, index TTL 120 jours) |
| `visit_count` | Nombre de visites (incrémenté si email+département déjà connu) |

---

## 5. Authentification

Le système utilise un mot de passe unique (défini dans `config.py`) sans gestion de comptes multiples :

1. L'administrateur entre son mot de passe dans la page de connexion
2. Le backend vérifie le mot de passe avec `bcrypt.checkpw()`
3. Un token JWT est généré avec PyJWT (expiration paramétrable)
4. Le token est stocké dans `localStorage` côté client
5. Toutes les requêtes protégées envoient le header : `Authorization: Bearer <token>`
6. Le décorateur `@require_auth` vérifie le token sur chaque route protégée

### 5.1 Configuration (`config.py`)

```env
MANAGER_EMAIL=admin@iut.fr
MANAGER_PASSWORD=votre_mot_de_passe
JWT_SECRET=cle_secrete_longue
JWT_EXPIRATION_HOURS=12
```

---

## 6. Conformité RGPD

| Mesure | Implémentation |
|---|---|
| Consentement explicite | Modal bloquante affichée avant tout formulaire |
| Suppression automatique | Index TTL MongoDB (120 jours après `created_at`) |
| Données minimales | Seuls les champs strictement nécessaires sont obligatoires |
| Droit de suppression | Endpoint `DELETE /api/visitors/{id}` et `DELETE /api/visitors` |
| Sécurisation | Mots de passe hachés, JWT signé, HTTPS recommandé |
| Information légale | Page `/legal` accessible à tout moment |

---

## 7. Guide d'installation

### 7.1 Prérequis

- Python 3.10+
- Node.js 18+
- MongoDB 6+ en local (port 27017)

### 7.2 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python app.py                # Lance sur http://localhost:5000
```

### 7.3 Frontend

```bash
cd frontend
npm install
npm run dev                  # Lance sur http://localhost:5173
```

### 7.4 Variables d'environnement

Créer un fichier `backend/.env` :

```env
MANAGER_EMAIL=admin@iut.fr
MANAGER_PASSWORD=MotDePasseF0rt!
JWT_SECRET=une_cle_tres_longue_et_aleatoire
MONGO_URI=mongodb://localhost:27017/sae_jpo
```
