# JPO IUT Montreuil — Gestion des visiteurs

Application web full-stack pour gérer les inscriptions des visiteurs lors des Journées Portes Ouvertes de l'IUT de Montreuil : un formulaire d'inscription pour les lycéens, et un tableau de bord sécurisé pour le personnel (statistiques, recherche, export CSV).

**Démo en ligne :** [sae-s4-phi.vercel.app](https://sae-s4-phi.vercel.app)

> Projet réalisé en équipe dans le cadre de la SAE S4 du BUT Informatique (IUT de Montreuil, Université Paris 8), présenté en avril 2026.

---

## Fonctionnalités

**Côté visiteur**
- Inscription en quelques étapes avec consentement RGPD explicite
- Validation des champs côté client (Zod)
- Page de confirmation avec formulaire d'avis (note de 1 à 5, commentaire, source)
- Détection des visites répétées (même email + département)

**Côté administrateur**
- Connexion sécurisée par JWT (session de 12 h)
- Statistiques en temps réel : total, répartition par département, par type de bac, inscriptions par jour
- Liste paginée des visiteurs avec recherche plein texte et filtres combinables
- Modification et suppression des fiches
- Export CSV filtré
- Consultation des avis laissés par les visiteurs

**Conformité RGPD**
- Suppression automatique des données après 120 jours grâce à un index TTL MongoDB

---

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Tailwind CSS, Recharts, Zod |
| Backend | Python, Flask (Blueprints), PyJWT, bcrypt, PyMongo |
| Base de données | MongoDB (Atlas en production) |
| Déploiement | Vercel (frontend statique + backend Flask en fonction serverless) |

---

## Architecture

```
.
├── api/
│   └── index.py          # Point d'entrée serverless Vercel → app Flask
├── backend/
│   ├── app.py            # Création de l'app Flask
│   ├── config.py         # Variables d'environnement
│   ├── core/             # Base de données, middleware JWT, sécurité
│   └── features/         # Un module par domaine
│       ├── auth/
│       ├── managers/
│       ├── stats/
│       └── visitors/
├── frontend/
│   └── src/
│       ├── api/          # Couche d'appel à l'API
│       ├── components/   # Onglets admin, graphiques, formulaire de connexion
│       └── pages/        # Formulaire visiteur, confirmation, admin
├── docs/                 # Documentation technique et utilisateur
└── vercel.json           # Build + routage /api → Flask
```

Le backend est organisé par fonctionnalité (Blueprints Flask) : chaque domaine a ses routes, son service et son modèle. Le frontend appelle l'API via des chemins relatifs `/api/...`, ce qui permet d'avoir le même code en local (proxy Vite) et en production (rewrite Vercel).

---

## API (extrait)

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/visitors` | — | Inscription d'un visiteur |
| `POST` | `/api/visitors/{id}/feedback` | — | Envoi d'un avis |
| `POST` | `/api/auth` | — | Connexion admin → JWT |
| `GET` | `/api/visitors` | JWT | Liste paginée, filtres, recherche |
| `PUT` / `DELETE` | `/api/visitors/{id}` | JWT | Modification / suppression |
| `GET` | `/api/visitors/export` | JWT | Export CSV |
| `GET` | `/api/stats/*` | — | Statistiques agrégées |
| `GET` / `POST` | `/api/managers` | JWT | Gestion des administrateurs |

---

## Lancer le projet en local

**Prérequis :** Python 3.10+, Node.js 20+, une instance MongoDB (locale ou Atlas).

### 1. Backend

```bash
pip install -r requirements.txt
cd backend
python app.py
```

L'API tourne sur `http://127.0.0.1:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`. Les appels à `/api` sont redirigés vers Flask par le proxy Vite.

### Variables d'environnement

Créer un fichier `backend/.env` :

| Variable | Description |
|---|---|
| `MONGO_URI` | URI MongoDB, avec le nom de la base (ex. `.../sae_jpo`) |
| `SECRET_KEY` | Clé de signature des JWT |
| `MANAGER_EMAIL` | Email du compte administrateur créé au démarrage |
| `MANAGER_PASSWORD` | Mot de passe de ce compte |

---

## Déploiement

Le projet est déployé sur Vercel en un seul projet :
- le frontend est buildé depuis `frontend/` et servi en statique ;
- les requêtes `/api/*` sont redirigées vers `api/index.py`, qui expose l'application Flask en fonction serverless ;
- la base de données est hébergée sur MongoDB Atlas.

Les variables d'environnement ci-dessus sont définies dans les paramètres du projet Vercel.

---

## Équipe

- **Zeki Inceoglu** — frontend (React), authentification et statistiques côté backend, déploiement
- **Camillia Emtir** — backend
- **Sergio Teixeira Goncalves**

La documentation détaillée (technique, utilisateur, justification des choix) se trouve dans le dossier [`docs/`](docs/).
