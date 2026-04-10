# Documentation Utilisateur
**Application JPO IUT — Guide complet**
SAE S4 — IUT de Montreuil — 2025–2026

---

## Partie 1 — Guide du visiteur

Ce guide s'adresse aux lycéens et futurs étudiants qui souhaitent s'inscrire lors de la Journée Portes Ouvertes (JPO) de l'IUT de Montreuil.

### 1.1 Accès à l'application

L'application est accessible via un navigateur web (Chrome, Firefox, Edge…) à l'adresse fournie par l'IUT le jour de la JPO. Aucune installation n'est nécessaire.

### 1.2 Inscription en 3 étapes

#### Étape 1 : Consentement RGPD

Au premier accès, une fenêtre s'affiche pour vous informer de la collecte de vos données personnelles. Vous devez lire et accepter les conditions avant de continuer. Vos données seront automatiquement supprimées après 120 jours.

#### Étape 2 : Remplir le formulaire

| Champ | Description |
|---|---|
| Prénom * | Votre prénom |
| Nom * | Votre nom de famille |
| Email * | Votre adresse email |
| Type de bac * | Votre filière actuelle (Général, STI2D, STL, Pro…) |
| Département souhaité * | Le département de l'IUT qui vous intéresse |
| En réorientation | Cochez si vous êtes déjà dans l'enseignement supérieur |
| Immersion | Cochez si vous souhaitez passer une journée dans le département |
| Dossier particulier | Cochez si vous avez une situation particulière (handicap, sportif de haut niveau…) |
| Numéro INE | Votre identifiant étudiant (optionnel, 11 caractères) |

*\* Champs obligatoires*

#### Étape 3 : Validation

Cliquez sur **S'inscrire**. Un message de confirmation s'affiche. Vous êtes ensuite redirigé vers une page où vous pouvez laisser votre avis sur la JPO.

### 1.3 Page de confirmation et avis

Après l'inscription, vous pouvez laisser un avis sur votre expérience à la JPO :

- Une note de 1 à 5 étoiles
- Un commentaire libre (optionnel)
- Comment vous avez entendu parler de la JPO (optionnel)

Ces informations sont complètement optionnelles.

### 1.4 Vos droits RGPD

- **Accès** : vous pouvez demander à voir vos données enregistrées
- **Rectification** : vous pouvez demander la correction de vos données
- **Suppression** : vous pouvez demander la suppression de vos données à tout moment
- **Portabilité** : vos données sont exportables au format CSV

Pour exercer ces droits, contactez l'administration de l'IUT de Montreuil.

---

## Partie 2 — Guide de l'administrateur

Ce guide est destiné au personnel de l'IUT chargé de gérer les inscriptions JPO via l'interface d'administration.

### 2.1 Connexion

Accédez à l'interface d'administration en ajoutant `/admin` à l'URL de l'application. Entrez le mot de passe administrateur unique. Après validation, vous accédez au tableau de bord.

> Le token de session est valable 12 heures. Passé ce délai, vous devrez vous reconnecter.

### 2.2 Tableau de bord — Onglets

| Onglet | Fonctionnalité |
|---|---|
| **Statistiques** | Vue globale : nombre de visiteurs, répartitions graphiques par département, bac et date |
| **Visiteurs** | Liste paginée avec filtres, recherche, modification et suppression |
| **Avis** | Consultation des retours et notes laissés par les visiteurs |
| **Paramètres** | Configuration de l'application |

### 2.3 Gestion des visiteurs

#### Filtres disponibles

| Filtre | Valeurs possibles |
|---|---|
| Recherche | Nom, email ou INE (texte libre) |
| Département | Tous / Informatique / GACO / INFOCOM / QLIO |
| Type de bac | Tous / Général / STI2D / STL / STMG / ST2S / PRO / Autre |
| Statut | Lycéen & Réorientation / Lycéen uniquement / Réorientation uniquement |
| Immersion | Tous / Immersion souhaitée / Sans immersion |
| Dossier particulier | Tous / Dossier particulier / Sans dossier |
| Date | Sélection d'un jour précis |

Les filtres se cumulent. La liste se met à jour automatiquement.

#### Modifier un visiteur

Cliquez sur **Modifier** sur la ligne du visiteur. Un formulaire s'ouvre avec les données actuelles. Modifiez les champs souhaités (prénom, nom, email, bac, département, INE, réorientation, immersion, dossier particulier) et sauvegardez.

#### Supprimer un visiteur

Cliquez sur **Suppr.** Une confirmation est demandée avant la suppression définitive.

### 2.4 Export CSV

Deux boutons d'export sont disponibles en bas de l'onglet Visiteurs :

- **Export filtré (CSV)** — exporte toutes les lignes correspondant aux filtres actifs avec les colonnes : prénom, nom, email, département, bac, réorientation, immersion, dossier particulier, INE, date d'inscription
- **Liste e-mails (CSV)** — exporte uniquement prénom, nom, email des visiteurs filtrés

> L'export respecte exactement les filtres affichés dans le tableau au moment du clic.

### 2.5 Statistiques

L'onglet Statistiques affiche :

- **Cartes KPI** : total visiteurs, réorientations, types de bac, départements, immersions, note moyenne
- **Par département** — graphique avec toggle Barres / Camembert
- **Par type de bac** — graphique avec toggle Barres / Camembert
- **Inscriptions par jour** — graphique en barres chronologique

### 2.6 Déconnexion

Cliquez sur **Déconnexion** en haut à droite. Le token est supprimé et vous êtes redirigé vers la page de connexion.
