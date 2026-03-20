# Dev Stack Advisor

An AI-powered developer tool that recommends the right tech stack for your project.

Ask a question about your app’s requirements, and the advisor queries three curated knowledge bases—technology profiles, project templates, and real-world case studies—then synthesizes a clear, actionable recommendation via streaming.

---

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4       |
| Backend  | Express 5, TypeScript, ts-node-dev                 |
| AI       | OpenAI Responses API + File Search (Vector Stores) |

---

## Project Structure

```
dev-stack-advisor/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── main.tsx
│       └── App.tsx          # Streaming Q&A + history UI
└── server/                  # Express backend
    ├── src/
    │   ├── index.ts         # Express app + /api/ask route
    │   ├── openai.ts        # OpenAI client
    │   └── service.ts       # queryStore() + buildPrompt()
    ├── data/
    │   ├── store-1-technology-profiles/
    │   ├── store-2-project-templates/
    │   └── store-3-case-studies/
    ├── scripts/
    │   └── setup.ts         # Vector store setup script
    ├── tsconfig.json
    └── tsconfig.scripts.json
```

---

## Prerequisites

* Node.js 18+
* OpenAI API key with access to:

  * Responses API
  * File Search

---

## Setup

### 1. Install Dependencies

```bash
cd client && npm install
cd ../server && npm install
```

---

### 2. Configure Environment Variables

Create `server/.env`:

```env
OPENAI_API_KEY=sk-...

# Filled after running setup script
VS_TECH=
VS_PROJECT=
VS_CASE=

PORT=5000
```

Create `client/.env.development`:

```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Run One-Time Setup Script

This creates the vector stores and uploads your knowledge base.

```bash
cd server && npm run setup
```

After running, copy the generated IDs into:

* `VS_TECH`
* `VS_PROJECT`
* `VS_CASE`

in your `server/.env`.

---

## Running Locally

Open two terminals:

```bash
# Terminal 1 — Backend
cd server && npm run server
```

```bash
# Terminal 2 — Frontend
cd client && npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## Available Scripts

### Client

| Script          | Description                   |
| --------------- | ----------------------------- |
| npm run dev     | Start Vite dev server         |
| npm run build   | Type-check + production build |
| npm run preview | Preview production build      |
| npm run lint    | Run ESLint                    |

---

### Server

| Script         | Description                                    |
| -------------- | ---------------------------------------------- |
| npm run server | Start Express server (ts-node-dev, hot reload) |
| npm run setup  | Create vector stores and upload files          |

---

## How It Works

1. User submits a question about project requirements
2. Server queries three vector stores in parallel:

   * Technology profiles (frameworks, databases, tools)
   * Project templates (SaaS, e-commerce, AI apps)
   * Case studies (real-world implementations)
3. Results are combined into a single prompt
4. Response is streamed back using `gpt-4.1-mini`
5. UI renders output in real-time (typewriter effect)

---

## Important Notes

* Run `npm run setup` **before** starting the server
* Missing vector store IDs will break `/api/ask`
* Keep `server/.env` in `.gitignore` (contains secrets)
* To update AI knowledge:

  1. Modify files in `server/data/`
  2. Re-run `npm run setup`
