![CI](https://github.com/Manon1655/Projet-Ecole2.0/actions/workflows/ci.yml/badge.svg)

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
# Projet Ecole — React + Vite (mise à jour)

Résumé
 - Frontend : React 18 + Vite (dev server : http://localhost:5173)
 - Backend : Node.js + Express dans le dossier `backend` (API : http://localhost:8080)
 - Base de données : MySQL (nom : `projet_ecole_final`)

Architecture et points importants
 - L'API se trouve dans le dossier `backend` et sert les uploads depuis `/uploads`.
 - Le backend utilise les variables d'environnement : `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `PORT`, `SECRET`, `FRONTEND_URL`.
 - `docker-compose.yml` construit le service API depuis `./backend` et démarre MySQL.

Endpoints principaux (exemples)
 - POST /auth/register
 - POST /auth/login
 - GET /books
 - POST /cart
 - GET /auth/user/:id/books

Démarrage rapide (Docker)
Depuis la racine du projet :
```bash
docker compose up -d --build
```
 - MySQL est mappé sur le port hôte `3307` → `3306` dans le conteneur (évite les conflits locaux).
 - L'API est exposée sur le port `8080` du conteneur.

Vérifier les logs et l'état
```bash
docker compose ps
docker compose logs -f api
```

Développement local
 - Frontend (dev) :
```bash
npm install
npm run dev
```
 - Backend (dev) :
```bash
cd backend
npm install
npm start
```

Variables d'environnement
 - Pour éviter de placer des secrets dans `docker-compose.yml`, crée un fichier `.env` à la racine et ajoute par exemple :
```
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=projet_ecole_final
MYSQL_USER=root
MYSQL_PASSWORD=root
PORT=8080
SECRET=change_me
FRONTEND_URL=http://localhost:5173
```
Ensuite utilise `env_file` ou `docker compose --env-file .env` selon ton workflow.

Uploads
 - Le backend sert les fichiers depuis `backend/uploads`. Si tu veux persister les uploads entre redémarrages, monte le volume :
  - `./backend/uploads:/app/uploads` (ajouter sous la section `api` dans `docker-compose.yml`).

Notes et recommandations
 - J'ai ajouté un `backend/package.json` minimal pour que le build Docker puisse installer les dépendances (`express`, `mysql2`, `bcrypt`, `jsonwebtoken`, `multer`, `cors`).
 - Change le `SECRET` avant mise en production ou utilise un système de secrets.
 - Si tu veux que je :
   - ajoute le montage `./backend/uploads` automatiquement, ou
   - crée un `.env` et référence `env_file` dans `docker-compose.yml`,
   dis-le moi et je l'ajoute.
