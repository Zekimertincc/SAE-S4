# Politique de confidentialité et conformité RGPD

## Responsable du traitement

**IUT de Montreuil** — Journée Portes Ouvertes (JPO)  
Dans le cadre de la SAE S4 / Parcours A, promotion 2025-2026.

---

## Données collectées

Lors de l'inscription à la JPO, les données suivantes sont collectées :

| Champ | Obligatoire | Description |
|---|---|---|
| Nom / Prénom | Oui | Identification du visiteur |
| Adresse e-mail | Oui | Communication post-JPO |
| Type de bac préparé | Oui | Statistiques et suivi |
| Département visité | Oui | Orientation vers la formation |
| Numéro INE | Oui | Identification scolaire unique |
| Réorientation | Non | Signalement d'une situation de réorientation |

---

## Finalité du traitement

Les données sont collectées exclusivement pour :

1. **Suivi des visiteurs** lors de la JPO (statistiques de fréquentation par département, type de profil).
2. **Communication post-JPO** : envoi d'informations sur les formations, propositions d'immersion ou de rendez-vous.
3. **Gestion interne** par le personnel autorisé de l'IUT.

---

## Destinataires des données

Les données sont accessibles **uniquement aux gestionnaires autorisés** de l'IUT de Montreuil (personnel habilité avec authentification). Elles ne sont **pas transmises à des tiers**.

---

## Consentement explicite

Conformément au RGPD (Règlement (UE) 2016/679), **le consentement explicite du visiteur est requis** avant tout enregistrement de ses données.

- Ce consentement est recueilli via une **case à cocher obligatoire** dans le formulaire d'inscription.
- Sans consentement coché, l'enregistrement est **techniquement bloqué** côté frontend ET côté backend (validation serveur).
- La date et la nature du consentement sont enregistrées avec la fiche visiteur (`rgpd_consent: true`).

---

## Durée de conservation

Les données sont conservées pendant **120 jours** à compter de la date d'inscription.

**Suppression automatique :** un index TTL (Time To Live) MongoDB est configuré sur le champ `created_at` de la collection `visitors`. MongoDB supprime automatiquement les documents dont la date dépasse 120 jours, sans intervention manuelle.

```
expireAfterSeconds = 120 × 24 × 60 × 60 = 10 368 000 secondes
```

Cette durée correspond à la période post-Parcoursup, au-delà de laquelle les données n'ont plus de finalité légitime.

---

## Droits des personnes concernées

Conformément au RGPD, tout visiteur dispose des droits suivants :

- **Droit d'accès** : obtenir une copie des données enregistrées.
- **Droit de rectification** : corriger des données inexactes.
- **Droit à l'effacement** : demander la suppression avant l'expiration automatique.
- **Droit d'opposition** : s'opposer au traitement dans les cas prévus par la loi.

Pour exercer ces droits, contacter l'administration de l'IUT de Montreuil.

---

## Sécurité des données

- Accès à l'interface gestionnaire protégé par **authentification par mot de passe** (JWT + bcrypt).
- Données stockées en base MongoDB locale, accessible uniquement depuis l'infrastructure de l'IUT.
- Aucune exposition publique des données sans authentification.

---

## Base légale

Le traitement repose sur le **consentement de la personne concernée** (article 6(1)(a) du RGPD), recueilli explicitement au moment de l'inscription.
