# Sadak Suraksha

Road safety complaint reporting portal — citizens report road hazards
(potholes, damaged signals, etc.) with photos; admins review, resolve,
or reject them. Includes an AI chatbot assistant.

## Structure

```
Sadak-Suraksha-Full/
├── Backend/     FastAPI backend (minestone-style layered architecture)
└── Frontend/    React + Vite frontend
```

## Backend

Converted to the `minestone` architecture pattern:
- Fully **async** SQLAlchemy (asyncpg for Postgres, aiosqlite fallback for local dev)
- `src/services/<module>/{controller,schema,serializer}.py` — layered business logic
- `src/urls/v1/` — thin route files
- `src/utils/response.py` — uniform response shape: `{status_code, success, message, data}`
- `src/utils/jwt_auth.py` — HS256 JWT (kept as HS256 per project requirement, not RS256)

### Run
```bash
cd Backend
cp .env.example .env        # edit DATABASE_URL, JWT_SECRET, OPENROUTER_API_KEY as needed
pip install -r src/requirements.txt
uvicorn src.main:app --host 127.0.0.1 --port 8000
```
Server starts at `http://localhost:8000`, docs at `/docs`.

## Frontend

Standard React + Vite app. Already updated to match the backend's new
uniform response shape — every API response is now read via
`response.data.data.<field>` instead of `response.data.<field>`
(the `message` field stayed at the top level, so error handling was
left unchanged).

### Run
```bash
cd Frontend
npm install
npm run dev
```

## Notes
- Backend API paths are unchanged (`/api/auth`, `/api/report`, `/api/myReport`,
  `/api/complaints`, `/api/resolved-reports`, `/api/chatbot`), so no routing
  changes were needed on the frontend beyond the response-shape update above.
- The backend wasn't run end-to-end in this environment (no network access
  to install `fastapi`/`sqlalchemy`/etc. here), but every file passed a
  Python syntax check. Test it locally with the steps above before deploying.
