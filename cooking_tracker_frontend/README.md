# Cooking Companion Frontend (React)

A lightweight React UI to manage recipes and cooking-related todo lists.

## Features
- Recipe management: list, search, create, edit, delete
- Todo list for cooking tasks: add, edit inline, toggle complete, delete
- Clean, responsive UI with built-in light/dark theme (persists)
- Environment-driven API base URL

## Quick Start
- Install: `npm install`
- Run: `npm start`
- Build: `npm run build`
- Test: `npm test`

## Backend Configuration
Set the following environment variable for the frontend:
- REACT_APP_API_BASE: Base URL for the backend REST API. Defaults to `/api` to support dev proxying.

Examples:
- `.env.development`:
  ```
  REACT_APP_API_BASE=http://localhost:8000
  ```
- `.env.production`:
  ```
  REACT_APP_API_BASE=https://api.example.com
  ```

Expected REST Endpoints:
- Recipes:
  - GET    {BASE}/recipes
  - POST   {BASE}/recipes
  - GET    {BASE}/recipes/:id
  - PUT    {BASE}/recipes/:id
  - DELETE {BASE}/recipes/:id
- Todos:
  - GET    {BASE}/todos
  - POST   {BASE}/todos
  - PUT    {BASE}/todos/:id
  - DELETE {BASE}/todos/:id

Response bodies should be JSON.

## Project Structure
- `src/services/api.js`: Minimal API client
- `src/services/ApiContext.js`: Context provider and hook
- `src/hooks/useLocalStorage.js`: Persistence helper
- `src/components/recipes/RecipeList.js`: Recipes index with actions
- `src/components/recipes/RecipeEditor.js`: Create/update form
- `src/components/todos/TodoList.js`: Cooking todo list
- `src/App.js`: Wiring, simple navigation, theming

## Accessibility
- Keyboard accessible forms and buttons
- Semantic headings, labels, and ARIA alerts for errors

## Notes
This UI assumes a functioning backend; if it is not yet available, you can stub endpoints or configure a mock server at `REACT_APP_API_BASE`.
