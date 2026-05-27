# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler
## Architecture

### Full-Stack Setup (Updated)
This project now features a complete architecture with:

- **Frontend:** React 18 + Vite (localhost:5173)
- **Backend:** Spring Boot 3.3.0 (localhost:8080)
- **Database:** MySQL (projetecolefinal)
# Projet Ecole Final

Plateforme web pour gérer et consulter une bibliothèque numérique (frontend React + backend Express + MySQL).

## Stack
- Frontend : React (v19) + Vite
- Backend  : Node.js + Express (`backend/server.js`)
- BDD      : MySQL (via `mysql2`)
- Auth     : JWT (`SECRET`), mot de passe haché avec `bcrypt`
- Uploads  : `multer` (dossier `backend/uploads/`)

## Fonctionnalités principales
- Parcours catalogue de livres, recherche et filtres
- Import de livres depuis `src/data/books.js` / `backend/books.json`
- Authentification : inscription / connexion (JWT)
- Profils utilisateurs, favoris, panier et commandes
- Upload de photo de profil

## Prérequis
- Node.js (v18+ recommandé)
- npm
- MySQL (local ou distant)

## Installation & démarrage (développement)

1. Cloner le repo

```bash
git clone <repo>
cd ProjetEcoleFinal
```

2. Installer et lancer le front

```bash
npm install
npm run dev
```

3. Installer et lancer le back

```bash
cd backend
npm install
npm start
```

Le front est disponible par défaut sur `http://localhost:5173` et le back sur `http://localhost:8080`.

## Variables d'environnement
Copier `.env.example` en `.env` puis remplir :

- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- `PORT` (optionnel, par défaut 8080)
- `SECRET` (clé JWT)
- `FRONTEND_URL` (ex: `http://localhost:5173`)

## Docker Compose (optionnel, local)
Exemple minimal pour démarrer MySQL et le backend :

```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: projet_ecole_final
      MYSQL_ROOT_PASSWORD: root
    ports:
      - '3306:3306'
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build: ./backend
    working_dir: /app
    command: node server.js
    environment:
      MYSQL_HOST: db
      MYSQL_USER: root
      MYSQL_PASSWORD: root
      MYSQL_DATABASE: projet_ecole_final
      SECRET: change_me
    ports:
      - '8080:8080'
    depends_on:
      - db

volumes:
  db_data:
```

## Tests
- Front et backend utilisent `jest`.
- Lancer les tests :

```bash
npm test
```

Ou pour le backend :

```bash
cd backend
npm test
```

## Scripts utiles
- `npm run dev` — démarre Vite en dev
- `npm run build` — build production front
- `npm start` — start production (backend)
- `npm run lint` — ESLint
- `npm run test` — Jest

## Déploiement
- Front : Vercel (build `npm run build`, output `dist/`)
- Back : Render (Root `backend/`, Start `npm start`)
- BDD : Railway / PlanetScale / RDS (MySQL)

Configurer `VITE_API_URL` sur Vercel pour pointer vers l'API deployée.

## Sécurité & bonnes pratiques
- Ne jamais committer `.env`.
- Ajouter `uploads/` à `.gitignore` (les migrations vers un stockage cloud sont recommandées en production).
- Révoquer toute clé si elle a été committée.

## Problèmes connus
- Le backend nécessite une base MySQL configurée — certaines routes échouent sans DB.
- Le README initial mentionnait Spring Boot (corrigé).

## Contribuer
- Créer une branche par fonctionnalité et ouvrir une PR vers `main`.

---
Si vous voulez, je peux :
- ajouter un `docker-compose.yml` complet,
- créer un script SQL d'initialisation,
- exécuter les tests et corriger les erreurs détectées.
