# Justification des choix techniques
**Application JPO IUT — Décisions d'architecture**
SAE S4 — IUT de Montreuil — 2025–2026

---

## 1. Choix de MongoDB

MongoDB est une base de données NoSQL orientée documents, utilisée ici pour stocker les fiches visiteurs.

### Pourquoi MongoDB ?

- **Schéma flexible** : les champs optionnels (INE, commentaire, heard_from) n'ont pas besoin d'exister pour tous les documents
- **Index TTL natif** : la suppression automatique après 120 jours pour le RGPD est triviale avec `expireAfterSeconds`
- **Recherche texte intégrée** : l'index `$text` permet la recherche sur plusieurs champs sans ORM complexe
- **Performance** : PyMongo est léger et très bien intégré avec Flask
- **ObjectId unique** par document, pas de migrations de schéma nécessaires

### Alternatives écartées

- **PostgreSQL** : plus adapté aux données relationnelles. Ici, il n'y a pas de relations entre tables, ce qui rend SQL sur-dimensionné
- **SQLite** : trop limité pour une vraie mise en production multi-utilisateurs

---

## 2. Choix de Flask (Python)

Flask est un micro-framework web Python minimaliste et modulaire.

### Pourquoi Flask ?

- **Légèreté** : aucune surcouche inutile, seules les briques nécessaires sont ajoutées
- **Architecture Blueprints** : permet d'organiser le code par domaine (visitors, auth, stats, managers)
- **Écosystème riche** : PyJWT, bcrypt, PyMongo, Flask-CORS sont stables et bien documentés
- **Python** est le langage principal de l'équipe, réduisant la courbe d'apprentissage

### Alternatives écartées

- **Django** : trop complet pour une API REST simple. L'ORM Django est inélégant avec MongoDB
- **Express.js (Node)** : aurait dupliqué l'écosystème JavaScript alors que le frontend utilise déjà TypeScript
- **FastAPI** : excellent pour les grosses APIs mais ajoute de la complexité non nécessaire ici

---

## 3. Choix de React + TypeScript

React est la bibliothèque UI la plus utilisée dans l'industrie. TypeScript ajoute le typage statique.

### Pourquoi React ?

- **Composants réutilisables** : chaque écran (LoginForm, TabBar, StatsTab…) est un composant indépendant
- **State management simple** : `useState` et `useEffect` suffisent pour ce projet
- **Écosystème** : Recharts pour les graphiques, React Router pour le routage, Zod pour la validation
- **TypeScript** : détecte les erreurs à la compilation, améliore la maintenabilité, autocomplétion dans l'IDE
- **Vite** : démarrage instantané, HMR très rapide, build optimisé

### Alternatives écartées

- **Vue.js** : bonne alternative mais écosystème moins mature pour les graphiques et moins connu de l'équipe
- **Svelte** : innovant mais écosystème plus jeune, moins de ressources pédagogiques disponibles

---

## 4. Choix de JWT pour l'authentification

JSON Web Token est un standard ouvert (RFC 7519) pour transmettre des informations de manière sécurisée.

### Pourquoi JWT ?

- **Stateless** : aucun stockage de session serveur nécessaire, le token est auto-suffisant
- **Expiration intégrée** : le token expire automatiquement après 12 heures
- **Simplicité** : PyJWT en Python + en-tête HTTP `Authorization: Bearer` en frontend
- **Standard industriel** : bien documenté, sécurisé si utilisé correctement (HS256)

### Alternatives écartées

- **Sessions Flask** : nécessite un stockage serveur (Redis ou base de données) pour les sessions
- **OAuth2** : sur-dimensionné pour un seul administrateur sans comptes tiers

---

## 5. Choix de Zod pour la validation

Zod est une bibliothèque TypeScript-first de validation de schémas.

### Pourquoi Zod ?

- **Typage complet** : l'inférence TypeScript est automatique à partir du schéma
- **Messages d'erreur précis en français** : personnalisables pour l'utilisateur final
- **Validation client-side** : améliore l'UX sans attendre la réponse du serveur

---

## 6. Conformité RGPD : décisions clés

| Contrainte RGPD | Décision technique prise |
|---|---|
| Consentement explicite | Modal bloquante affichée avant tout accès au formulaire |
| Minimisation des données | Seuls les champs strictement nécessaires sont obligatoires |
| Durée de conservation limitée | Index TTL MongoDB : suppression automatique à 120 jours |
| Droit à la suppression | Route `DELETE` implémentée et accessible depuis le tableau de bord |
| Sécurité des données | bcrypt pour les mots de passe, JWT signé, HTTPS recommandé |
| Information transparente | Page `/legal` accessible à tout moment |

---

## 7. Choix de la licence MIT

Le projet est publié sous licence MIT, la licence open source la plus utilisée dans l'écosystème JavaScript/Python.

### Pourquoi la licence MIT ?

- **Permissive** : l'IUT ou d'autres départements peuvent réutiliser le code librement
- **Compatible** : toutes les dépendances du projet (React, Flask, MongoDB) sont compatibles MIT ou Apache 2.0
- **Simplicité** : une seule condition — conserver la notice de copyright dans les distributions
- **Reconnaissance académique** : la mention des auteurs est préservée dans toute réutilisation

### Alternatives écartées

- **GPL v3** : impose que toute version modifiée soit aussi open source — contraignant pour l'IUT
- **Propriétaire** : contraire à l'esprit pédagogique de la SAE

---

## 8. Synthèse

Les choix techniques de ce projet répondent à trois critères principaux :

- **Adéquation** : chaque technologie est adaptée à son rôle spécifique dans le projet
- **Accessibilité** : toutes les technologies choisies sont libres, gratuites et bien documentées en français
- **Conformité** : les contraintes RGPD sont intégrées dès la conception et non ajoutées après coup

| Technologie | Rôle dans le projet |
|---|---|
| React 19 + TypeScript | Interface utilisateur SPA typée et maintenable |
| Vite | Build ultra-rapide en développement |
| Flask + Blueprints | API REST modulaire en Python |
| PyJWT + bcrypt | Authentification sécurisée |
| MongoDB + TTL | Stockage flexible + RGPD natif |
| Zod | Validation robuste des formulaires |
| Recharts | Visualisation des statistiques |
| Licence MIT | Réutilisation libre avec attribution |
