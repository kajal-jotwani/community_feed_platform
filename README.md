# Playto — Community Feed

A small community feed app: post updates, comment, like, and see who’s on the leaderboard. Built with a Django API and a React frontend.

## Run locally (no Docker)

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Set a database (optional). If you don’t set `DATABASE_URL`, the app uses SQLite:

```bash
export DATABASE_URL=sqlite:///db.sqlite3
```
I have used neon db for postgres database!
Then:

```bash
python manage.py migrate
python manage.py runserver
```

**Frontend**

From the project root:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The dev server proxies `/api` to the backend on port 8000, so have the backend running first.

---

## Run with Docker

From the project root:

```bash
docker compose up --build
```

- App: **http://localhost:3000**
- API: **http://localhost:8000**

The frontend container proxies `/api` to the backend. The backend uses Postgres and runs migrations on startup.

---

