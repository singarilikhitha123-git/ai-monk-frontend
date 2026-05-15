# AI Monk – Frontend

A React + TypeScript app for building and managing a **Nested Tags Tree**. You can create, collapse, rename, and export a recursive tree hierarchy, with data persisted via a REST API.

## Tech Stack

- React 18 + TypeScript
- Vite
- Plain CSS

## Features

- Recursive `TagView` component — supports unlimited nesting
- Collapse/expand any node with v / > toggle
- Add Child button — converts a leaf node into a parent
- Click on any tag name to rename it inline (Enter to save)
- Export button — outputs clean JSON and saves to the backend
- Loads previously saved trees from the backend on page open
- PUT on export when editing a loaded tree, POST when creating new

## Project Structure

```
src/
  components/
    TagView.tsx       # Recursive tag component
    TagView.css       # Tag styles
  App.tsx             # Root component, state, API calls
  App.css             # Layout styles
  types.ts            # TagNode and SavedTree types
  main.tsx            # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000` (see [ai-monk-backend](https://github.com/singarilikhitha123-git/ai-monk-backend))

### Setup

```bash
# Install dependencies
npm install

# Create env file
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## Deployment

Deployed on **Vercel**. Each push to `main` triggers an automatic redeploy.

Set `VITE_API_URL` in Vercel's Environment Variables to your Render backend URL.

## API Integration

| Action | Method | Endpoint |
|---|---|---|
| Load saved trees on open | GET | `/trees` |
| Export new tree | POST | `/trees` |
| Export updated tree | PUT | `/trees/{id}` |
