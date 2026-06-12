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

### Key Features

#### Library Management
- **Add Books Modal:** Create individual books with title, author, genre, price, rating, etc.
- **Import Books Feature:** Bulk import all books from `books.js` into the MySQL database
  - Click the settings button in the Library header
  - Select "Importer les livres du site"
  - Confirms the number of books to import
  - Books are synced with the database

#### User Authentication
- Register and login with database persistence
- User profiles with complete information
- Photo upload capability

#### API Endpoints
All endpoints are available at `http://localhost:8080/api`

**Books:**
- POST /books - Create single book
- POST /books/import - Import multiple books from array
- GET /books - Get all books
- GET /books/{id} - Get specific book
- GET /books/search?title= - Search by title
- GET /books/genre/{genre} - Filter by genre

**Users:**
- POST /auth/register - Register new user
- POST /auth/login - Login user
- GET /auth/user/{id} - Get user profile
- PUT /auth/user/{id} - Update user profile

## Getting Started

### Prerequisites
- Node.js and npm (for React)
- Java 17+ and Maven (for Spring Boot)
- MySQL 8.0+

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd api
mvn clean install
mvn spring-boot:run
```

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE projetecolefinal;
```
2. Hibernate will auto-create tables on first run (ddl-auto=update)
### Docker (option alternative)

If you have Docker installed you can run MySQL + API without installing Java/Maven locally:

```bash
docker compose up --build
```

This will start MySQL (port 3306) and the API (port 8080). The API will use environment variables to connect to MySQL.
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
