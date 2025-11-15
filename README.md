# HoosFunding

HoosFunding is a lightweight full-stack demo that helps a single department collect funding/resource requests and share AI-assisted priorities with operations teams.

## Features
- Submit requests with role, category, urgency, and description.
- Admin dashboard showing pending requests, category pie chart, and contextual department summary.
- AI recommendation panel (mocked) ready to connect to any LLM via `LLM_API_URL` + `LLM_API_KEY`.

## Project Structure
```
HoosFunding/
  package.json          # root scripts to run both apps
  client/               # React + Vite + Tailwind UI
  server/               # Express + TypeScript API
```

## Getting Started
### Backend
```bash
cd server
npm install
npm run dev
```
The API listens on `http://localhost:4000` by default. Configure `PORT`, `LLM_API_URL`, and `LLM_API_KEY` in a `.env` file if needed.

### Frontend
```bash
cd client
npm install
npm run dev
```
Open the Vite URL (usually `http://localhost:5173`). The app expects the server at `http://localhost:4000`, but you can override with `VITE_API_BASE_URL`.

### Run both together
```bash
npm install
npm run dev
```
This uses `concurrently` to start both the frontend and backend in one step.

## AI Integration
`server/src/aiService.ts` currently returns a mocked recommendation payload. To plug in a real LLM later:
1. Set `LLM_API_URL` and `LLM_API_KEY` env vars.
2. Replace the TODO block with a real `fetch` call to Claude, OpenAI, etc.
3. Return data that matches the `RecommendationResponse` shape.

## Testing Notes
- Data is stored in-memory for demo purposes.
- Restarting the server resets seeded requests.
- Add your own instrumentation or persistence as needed.