# 21_liste_anomalies.md

## Anomalie 1 — Backend nécessite la BDD
- Description : Le backend renvoie des erreurs de connexion SQL si MySQL n'est pas configuré.
- Contexte : Démarrage du serveur sans variables `MYSQL_*` ou base non initialisée.
- Impact : Endpoints `/books`, `/auth/*`, `/orders` inaccessibles.
- Reproduit à chaque fois : Oui

## Anomalie 2 — README initial incorrect
- Description : Le README mentionnait Spring Boot alors que le backend est en Express.
- Impact : Confusion pour les contributeurs / déploiement.
- Reproduit à chaque fois : N/A (documentation)

## Anomalie 3 — .env potentiellement committé / uploads non ignorés
- Description : `.env` était absent du `.gitignore` initial et `uploads/` n'était pas exclu.
- Impact : Risque de fuite de secrets ou commit de fichiers binaires.
- Reproduit à chaque fois : Dépend de l'historique Git

## Anomalie 4 — CORS en production
- Description : CORS doit être restreint à l'URL front; vérifier `FRONTEND_URL` en prod.
- Impact : Requêtes front→back bloquées en prod si mal configuré.
- Reproduit à chaque fois : Non

## Anomalie 5 — Pas de script d'initialisation DB
- Description : Absence d'un script SQL ou migration pour créer les tables requises.
- Impact : Difficile pour quelqu'un d'initialiser la base et démarrer le projet.
- Reproduit à chaque fois : Oui

## Total d'anomalies détectées
5 (3 bloquantes/majeures : DB non fournie, secrets exposés, pas de migrations)
# 21_liste_anomalies.md

## Anomalie 1
- Description : (ex: La page /dashboard affiche une erreur 401)
- Contexte : (ex: Après connexion, la redirection échoue)
- Impact : (ex: L'utilisateur ne peut pas accéder à son espace)
- Reproduit à chaque fois : Oui / Non

## Anomalie 2
- Description : (ex: Les images ne s'affichent pas en prod)
- Contexte : (ex: Les URLs pointent vers localhost)
- Impact : (ex: Visuel cassé sur toutes les pages)
- Reproduit à chaque fois : Oui / Non

## Anomalie 3
- Description : (ex: Erreur CORS sur /api/login)
- Contexte : (ex: Le front appelle le back mais CORS bloque)
- Impact : (ex: Login impossible en production)
- Reproduit à chaque fois : Oui / Non

## Anomalie 4
- Description :
- Contexte :
- Impact :
- Reproduit à chaque fois :

## Anomalie 5
- Description :
- Contexte :
- Impact :
- Reproduit à chaque fois :

## Total d'anomalies détectées
(ex: 3 anomalies dont 1 bloquante)