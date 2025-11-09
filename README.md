# AWAD Exercise Week 4 — Run with Docker

This repository contains a small full-stack example (NestJS backend + Vite React frontend) and a PostgreSQL database. The easiest way to run the whole app locally is with Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your machine. Verify with:

```bash
docker --version
docker compose version
```

## Environment variables (.env)

The backend needs a `DATABASE_URL` environment variable that points to a Postgres database. You should create a `.env` file in the `backend/` folder before starting.

The repository provides a `.env.example` file, copy it and fill in the values:

```bash
cp backend/.env.example backend/.env
# then edit backend/.env and set DATABASE_URL accordingly
```

Notes:

- You can either keep the Postgres service configuration in `docker-compose.yml` and use the matching `DATABASE_URL` (the compose file in this project sets the DB user `postgres` and password `supersecret` for the `awad_week4_db` database), or change the DB settings in `docker-compose.yml` and then update the `DATABASE_URL` in `backend/.env` to match.
- When using Docker Compose, the backend service in the compose file already receives `DATABASE_URL` set to connect to the internal DB service; creating `backend/.env` is still useful for local development and for generating Prisma clients during the image build.

## Build and run with Docker Compose

From the repository root run:

```bash
docker compose up -d --build
```

This command will:

- build the `backend` and `frontend` images
- start a Postgres container
- start the backend (exposed on port 3000) and frontend (served on port 8080)

Open your browser to:

- Frontend (app): http://localhost:8080
- Backend API (optional): http://localhost:3000

## Useful Docker Compose commands

- View logs for all services:

```bash
docker compose logs -f
```

- Tail logs for the backend only:

```bash
docker compose logs -f backend
```

- Stop and remove containers created by compose:

```bash
docker compose down
```

## Troubleshooting

- If the backend build fails on `prisma generate` due to a missing `DATABASE_URL`, ensure `backend/.env` exists and contains `DATABASE_URL` (the generator may require it at build time). You can also rely on the `DATABASE_URL` set in `docker-compose.yml` when the service runs inside Docker.
- If ports are already in use, change the host ports in `docker-compose.yml` (the file maps host `8080:80` for frontend and `3000:3000` for backend by default).
- If the frontend cannot reach the backend from the browser, ensure the frontend is configured to call `http://localhost:3000` (this depends on how the frontend builds its API URL — check `frontend/src/lib/http.ts` or environment variables used by Vite).

## Stop and cleanup

To stop and remove containers and networks created by compose:

```bash
docker compose down --volumes
```

This will also remove the Postgres data volume if you use `--volumes`.

---
