# node-ai

AI-powered chat assistant with document retrieval and long-term session support.

## 🚀 Project Overview

This repository implements a full-stack AI chat app using:

- Backend: Node.js, Express, MongoDB, Redis, Qdrant, Google Gemini (via `@google/genai` / `@google/generative-ai`)
- Frontend: Next.js + React + Tailwind CSS
- File/document upload & semantic search (`/upload`, `/docs-chat`)
- Chat sessions with history (`/session`, `/history`, `/sessions`)

## 📁 Repository Structure

`backend/`
- `index.js`: Express server and routes
- `chatService.js`, `controllers/chatController.js`, `controllers/documentController.js`
- `models/ChatMessage.js` (Mongo schema)
- `db/` (Mongo and Qdrant clients), `redisClient.js`
- `services/`: embedding, RAG, vector logic

`frontend/`
- Next.js app with chat UI and API calls to backend

`docker-compose.yml`
- Compose config for backend, frontend, db services if present

## ⚙️ Requirements

- Node.js 18+ (or 20)
- npm
- Docker & docker-compose (optional but recommended)
- MongoDB and Redis (or via docker-compose)

## 🛠️ Backend Setup

1. `cd backend`
2. `npm install`
3. Create `.env` with values:
	- `MONGODB_URI=mongodb://localhost:27017/ai` (or your URI)
	- `REDIS_URL=redis://localhost:6379`
	- `QDRANT_URL=http://localhost:6333`
	- `GOOGLE_API_KEY=your_key`
	- `PROJECT_ID` etc (if required by Gemini client)
4. Run server:
	- `npm start`
	- or `nodemon index.js` for auto reload

### Backend Endpoints

- `POST /session`: body `{ userId }` -> generates `sessionId`
- `POST /chat`: body `{ userId, sessionId, message }` -> AI reply + persistent context
- `POST /history`: body `{ userId, sessionId }` -> Redis history list
- `GET /sessions/:userId` -> saved session IDs
- `GET /history/:userId/:sessionId` -> Mongo history documents
- `POST /upload` multipart `file` -> store + embed
- `POST /docs-chat` -> similarity search + QA in docs

## 🖥️ Frontend Setup

1. `cd frontend`
2. `npm install`
3. Run:
	- `npm run dev`
4. Build:
	- `npm run build`
	- `npm run start`

## 🐳 Docker Compose (if available)

1. From repo root:
	- `docker-compose up --build`
2. Services should expose backend at `http://localhost:3000` and frontend at `http://localhost:3001` (adjust all values in compose file)

## 🧪 Testing / Debugging

- Check backend logs for connections to Mongo/Redis/Qdrant.
- Inspect `/uploads` for files.
- Ensure `MONGO_URI`, `REDIS_URL`, `QDRANT_URL`, `GOOGLE_API_KEY`, and `CORS` are configured.

## 💡 Tips

- The project currently uses both `@google/genai` and `@google/generative-ai` libraries; ensure you have proper auth and quota.
- If you add `tailwind.config.js`, run frontend build again and include `@tailwindcss/postcss` plugin.
- `express-rate-limit` is configured to 20 req/min.

## 📦 Notes

- Some dependencies may include typos (e.g., `expres` in backend `package.json`). Keep in sync with real packages.
- Adjust vector dimensions in Qdrant setup to match embedding model, currently set to `3072` in `index.js` comments.

## 📝 License

MIT
