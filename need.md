# Analyse des écarts – SAE S4

## 1. Résumé global du projet

Application React (TypeScript) + Flask (Python) + MongoDB. MVP fonctionnel en local avec les fonctionnalités principales en place. Les filtres avancés, l'export CSV et le formulaire visiteur sont complets. Les statistiques existent sous forme de BarCharts personnalisés mais sans pie chart. La documentation est entièrement vide. Aucun déploiement configuré.

**Tech stack :** React 19 / Vite / TypeScript / Tailwind CSS 4 – Flask 3 / PyJWT / bcrypt / PyMongo – MongoDB local

---

## 2. Fonctionnalités déjà implémentées

### Côté visiteur (public)
- Formulaire de saisie : `first_name`, `last_name`, `email`, `bac_type`, `department`, `ine` (11 chars obligatoires), `reorientation` (checkbox)
  - Fichier : `frontend/src/pages/VisitorForm.tsx`
- Validation client-side (Zod) : champs requis, format email, longueur INE
- Page de confirmation avec récapitulatif des données et notice RGPD minimale
  - Fichier : `frontend/src/pages/Confirmation.tsx`
- Détection de doublon (même email + département → incrémente `visit_count`)
- Interface responsive (Tailwind)
- Séparation visiteurs / gestionnaires (routes différentes, pas d'accès admin côté public)

### Côté gestionnaire (authentifié)
- Login par mot de passe unique (JWT 8h, stocké localStorage)
  - Fichiers : `backend/features/auth/routes.py`, `frontend/src/components/LoginForm.tsx`
- Liste des visiteurs avec pagination (15 items/page)
  - Fichier : `frontend/src/components/VisitorTab.tsx`
- Filtres actifs :
  - Recherche par nom, email, INE (regex, server-side)
  - Filtre par département (dropdown)
  - Filtre par type de bac (dropdown)
  - Filtre réorientation (Tous / Lycéen / Réorientation)
  - Filtre par date (jour exact)
- Tri : non précisé mais pagination fonctionnelle
- Correction des données : modal d'édition inline (tous champs sauf créé_at)
- Suppression individuelle avec confirmation
- Suppression totale avec double confirmation
- Export CSV filtré (tous champs configurables)
  - Endpoint : `GET /api/visitors/export`
- Export liste emails CSV (`first_name`, `last_name`, `email`)
- Changement de mot de passe (Settings tab)
  - Fichier : `frontend/src/components/SettingsTab.tsx`

### Statistiques (onglet Stats)
- Total visiteurs, nombre de départements, nombre de types de bac
- **BarChart par département** (composant custom)
- **BarChart par type de bac** (composant custom)
  - Fichiers : `frontend/src/components/StatsTab.tsx`, `frontend/src/components/BarChart.tsx`
  - API : `GET /api/stats/department`, `GET /api/stats/bac_type`, `GET /api/stats/total`

### Backend
- API REST Flask avec Swagger (`/api/docs`)
- Authentification JWT + bcrypt
- RBAC partiel (roles : `admin`, `secretaire`, `responsable`)
- Endpoints CRUD visiteurs protégés par `@require_auth`
- Agrégations MongoDB (`$group`) pour stats

---

## 3. Fonctionnalités partiellement implémentées

### Visualisation graphique
**Ce qui existe :** BarCharts personnalisés (par département et par bac type) dans `StatsTab.tsx` / `BarChart.tsx`.  
**Ce qui manque :**  
- Aucun **pie chart** (camembert) — la consigne parle de "visualisation graphique" sans imposer le type, mais un pie chart est l'attendu standard pour ce type de données.  
- Les statistiques de réorientation (`reorientation=true`) sont calculées **côté client sur la page courante seulement** (pas une agrégation server-side globale) → le chiffre affiché est faux si le total dépasse 15 visiteurs.  
- Pas de graphique temporel (évolution dans la journée).

### RGPD
**Ce qui existe :** Une phrase sur la page de confirmation — *"Vos données sont collectées dans le cadre de la JPO et supprimées après Parcoursup (RGPD)."*  
**Ce qui manque :**  
- Aucune suppression automatique des données après la période Parcoursup (pas de job, pas de TTL MongoDB).  
- Pas de documentation légale formelle (`docs/legal.md` est vide, 0 octet).

### Gestion des gestionnaires (managers)
**Ce qui existe :** Routes CRUD complètes côté backend (`GET/POST/PUT/DELETE /api/managers`), modèle avec rôles.  
**Ce qui manque :**  
- Aucune interface frontend pour gérer les comptes gestionnaires (créer, modifier, supprimer).  
- `SettingsTab.tsx` ne gère que le changement de mot de passe, pas la gestion des comptes.

### Validation mot de passe
**Incohérence :** Backend impose minimum 6 caractères (`service.py`), frontend `SettingsTab.tsx` valide à partir de 4 caractères.

### Paramètres de l'application
**Ce qui existe :** Changement de mot de passe uniquement.  
**Ce qui manque :** Modification d'autres paramètres (départements disponibles, types de bac, configuration générale) — aucun écran ni endpoint dédié.

---

## 4. Fonctionnalités manquantes

### Dashboard graphique avec pie chart
- **Aucun pie chart (camembert) n'existe dans le code.**  
- La consigne mentionne "visualisation graphique des données" — le BarChart existe, mais un **pie chart des visiteurs par département / mention** est absent.  
- Fichier de composant inexistant (ni `PieChart.tsx` ni équivalent dans `frontend/src/components/`).

### Documentation (tous les fichiers sont vides)
- `docs/legal.md` — 0 octet
- `docs/technique.md` — 0 octet
- `docs/utilisateur.md` — 0 octet
- `docs/justifications.md` — 0 octet
- Pas de `.env.example`
- `scripts/init_db.py` — 0 octet

### Déploiement
- Aucun `Dockerfile`, `docker-compose.yml`, ni configuration CI/CD
- L'application est développement local uniquement
- La consigne exige "Application déployée fonctionnelle"

### Tests
- Aucun fichier de test (ni backend, ni frontend)

### Tri des données
- La consigne demande "filtrage, tri et pagination" — le tri par colonne (clic sur en-tête) n'est pas implémenté dans `VisitorTab.tsx`

### Consultation par "dossiers particuliers"
- Le champ `dossier_particulier` existe en base et dans le formulaire d'édition, mais aucun filtre dédié dans la liste gestionnaire

### Gestion interface des managers (frontend)
- Le CRUD managers existe côté API mais pas d'interface dans l'admin dashboard

---

## 5. Écarts ou incohérences par rapport à la consigne

| Sujet | Consigne | Réalité | Écart |
|---|---|---|---|
| Visualisation graphique | "Visualisation graphique des données" | BarCharts uniquement, pas de pie chart | Partiel |
| Filtrage par "dossiers particuliers" | "consultation par... dossiers particuliers" | Champ présent en DB, absent des filtres | Manquant |
| Tri des données | "Filtrage, tri et pagination" | Filtrage ✓, pagination ✓, tri ✗ | Manquant |
| Modification paramètres app | "Modification des paramètres de l'application" | Seul le mot de passe est modifiable | Partiel |
| Licence open source | "Licence open source + justification README" | README présent, vérifier si licence déclarée | À vérifier |
| Documentation technique | Livrables attendus | `docs/technique.md` vide | Manquant |
| Documentation utilisateur | Livrables attendus | `docs/utilisateur.md` vide | Manquant |
| Justification technique | Livrables attendus | `docs/justifications.md` vide | Manquant |
| Application déployée | "Application déployée fonctionnelle" | Local uniquement | Manquant |
| RGPD - suppression données | "Suppression après période Parcoursup" | Mention textuelle seulement, pas implémenté | Partiel |
| Stat réorientation (globale) | Données pour graphiques | Calcul côté client sur page actuelle uniquement | Incorrect |
| Cohérence validation MDP | Min 6 chars backend / min 4 frontend | Incohérence | Bug |
| Vérification ancien MDP | Bonne pratique sécurité | Absent du PUT `/api/admin/password` | Risque |
| Champs visiteur supplémentaires | Formulaire simplifié | `specialite_1/2`, `etablissement`, `ville`, `immersion` en DB mais pas dans le formulaire public | Acceptable ou à décider |

---

## 6. Priorisation des tâches restantes

### Urgent (bloque la soutenance ou la note)
1. **Remplir `docs/technique.md`** — Architecture, choix techniques, schéma DB, stack
2. **Remplir `docs/utilisateur.md`** — Guide d'utilisation visiteur + gestionnaire
3. **Remplir `docs/justifications.md`** — Justification des choix (MongoDB vs SQL, JWT, etc.)
4. **Remplir `docs/legal.md`** — Politique RGPD, données collectées, durée de conservation
5. **Ajouter un pie chart** dans `StatsTab.tsx` (par département ou mention) — demande ~30min avec un composant custom similaire à `BarChart.tsx`
6. **Corriger le calcul de la stat réorientation** dans `StatsTab.tsx` → utiliser un endpoint `GET /api/stats/reorientation` côté backend (agrégation globale, pas page courante)

### Important (impacte la conformité ou la qualité)
7. **Déploiement** : Ajouter un `Dockerfile` + `docker-compose.yml` pour MongoDB + Flask + Vite, ou déployer sur une plateforme (Railway, Render, VPS)
8. **Tri par colonne** dans `VisitorTab.tsx` (clic sur en-tête Name, Bac, Date, etc.) + paramètre `sort_by`/`sort_order` dans l'API
9. **Filtre dossier particulier** dans `VisitorTab.tsx`
10. **Corriger incohérence validation MDP** : aligner frontend à 6 caractères minimum (`SettingsTab.tsx`)
11. **Créer `.env.example`** avec toutes les variables (MONGO_URI, SECRET_KEY, MANAGER_EMAIL, MANAGER_PASSWORD)
12. **Vérifier la licence** dans `README.md` — doit nommer une licence open source (MIT, Apache, etc.) avec justification

### Bonus (valeur ajoutée, non bloquant)
13. Interface frontend pour gérer les comptes gestionnaires (CRUD déjà implémenté en API)
14. Suppression automatique des données (TTL MongoDB ou cron job) pour conformité RGPD réelle
15. Graphique temporel (évolution des visites dans la journée)
16. Vérification de l'ancien mot de passe avant changement (`PUT /api/admin/password`)
17. Remplir `scripts/init_db.py` pour faciliter l'initialisation

---

## 7. Recommandations concrètes

### 1. Pie chart — `frontend/src/components/StatsTab.tsx` + nouveau composant
Créer `frontend/src/components/PieChart.tsx` sur le modèle de `BarChart.tsx`. Utiliser les données déjà disponibles via `GET /api/stats/department`. Intégrer dans `StatsTab.tsx` aux côtés des BarCharts existants.

### 2. Fix stat réorientation globale — `backend/features/stats/`
Ajouter dans `backend/features/stats/routes.py` :
```
GET /api/stats/reorientation → {reorientation_count: N}
```
Agrégation MongoDB : `{$match: {reorientation: true}}` + `$count`. Consommer dans `StatsTab.tsx` à la place du calcul client-side.

### 3. Tri colonnes — `frontend/src/components/VisitorTab.tsx` + `backend/features/visitors/visitors_routes.py`
Ajouter params `sort_by` (ex: `last_name`, `created_at`) et `sort_order` (`asc`/`desc`) dans l'appel API. Côté backend `visitors_service.py`, passer au `.sort()` PyMongo. Côté frontend, rendre les en-têtes de colonnes cliquables.

### 4. Docs — remplir les 4 fichiers vides dans `docs/`
- `technique.md` : décrire l'architecture (React SPA → Flask REST → MongoDB), le schéma des collections, les choix techniques
- `utilisateur.md` : captures d'écran ou description des écrans visiteur et gestionnaire
- `justifications.md` : pourquoi MongoDB (schema flexible, pas de migrations), pourquoi JWT, pourquoi Flask
- `legal.md` : données collectées (liste), base légale, durée de conservation, droits utilisateurs, contact DPO

### 5. Déploiement minimal
Ajouter à la racine :
- `docker-compose.yml` avec services `mongo`, `backend`, `frontend`
- `backend/Dockerfile` (python:3.11-slim, pip install, CMD python app.py)
- `frontend/Dockerfile` (node:20-alpine, npm build, serve avec nginx ou vite preview)
Ou déployer sur Railway/Render (gratuit, facile, MongoDB Atlas pour la DB).

### 6. Fix validation MDP — `frontend/src/components/SettingsTab.tsx`
Changer la validation Zod/manuelle de `minLength(4)` en `minLength(6)` pour cohérence avec le backend.

### 7. Filtre dossier particulier — `frontend/src/components/VisitorTab.tsx`
Ajouter un `<select>` "Dossier particulier" (Tous / Oui / Non). Passer `dossier_particulier=true/false` dans les params API. Côté backend `visitors_service.py`, ajouter le filtre dans la query MongoDB (déjà supporté probablement).

### 8. Licence — `README.md`
Ajouter une section "Licence" avec le nom (ex: MIT) et une phrase de justification (ex: "licence permissive, compatible avec un usage académique et open source").
