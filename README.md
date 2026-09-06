# Exercise Progress Tracker

Monorepo full stack -verkkosovellukselle (FastAPI, React + TypeScript, PostgreSQL).

## Esitiedot
- Docker & Docker Compose
- Node.js 20+ (lokaali kehitys)
- Python 3.12+ (lokaali kehitys)

## Käynnistys (Docker Compose)

1. Kopioi ympäristömuuttujamalli:
   ```bash
   cp .env.example .env
   ```

2. Rakenna ja käynnistä kontit:
   ```bash
   docker compose up --build -d
   ```

## Palveluiden osoitteet

| Palvelu | Osoite | Kuvaus |
| :--- | :--- | :--- |
| **Frontend (Web)** | http://localhost:5173 | React + TypeScript SPA |
| **Backend API** | http://localhost:8000 | FastAPI REST API |
| **API Docs (Swagger)** | http://localhost:8000/docs | Interaktiivinen OpenAPI-dokumentaatio |
| **Health Check** | http://localhost:8000/health | Rajapinnan tilatarkistus |

## Vianmääritys
- **Portti varattu:** Varmista etteivät lokaalit Postgres- tai Node-prosessit varaa portteja 5432, 8000 tai 5173.
- **Tietokantayhteys:** Konttien sisäinen liikenne käyttää isäntänimenä `db`, ei `localhost`.

Dokumentaatio: [docs/sprints/README.md](docs/sprints/README.md)
