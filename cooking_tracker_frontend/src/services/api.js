//
// Lightweight API client for the Cooking Companion frontend.
// Uses fetch and provides CRUD helpers for recipes and todos.
//
/* eslint-disable no-console */

// PUBLIC_INTERFACE
export class ApiClient {
  /**
   * Create a new ApiClient
   * @param {string} baseUrl - Base URL for the backend API (e.g. https://api.example.com or /api)
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl?.replace(/\/$/, '') || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(path, { method = 'GET', body, headers } = {}) {
    const url = `${this.baseUrl}${path}`;
    const opts = {
      method,
      headers: { ...this.defaultHeaders, ...(headers || {}) },
    };
    if (body !== undefined) opts.body = JSON.stringify(body);

    try {
      const res = await fetch(url, opts);
      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await res.json().catch(() => ({})) : await res.text();
      if (!res.ok) {
        const error = new Error(payload?.message || `Request failed: ${res.status}`);
        error.status = res.status;
        error.payload = payload;
        throw error;
      }
      return payload;
    } catch (err) {
      console.error('API error', err);
      throw err;
    }
  }

  // Recipes
  // PUBLIC_INTERFACE
  listRecipes() {
    return this.request('/recipes', { method: 'GET' });
  }
  // PUBLIC_INTERFACE
  getRecipe(id) {
    return this.request(`/recipes/${encodeURIComponent(id)}`, { method: 'GET' });
  }
  // PUBLIC_INTERFACE
  createRecipe(recipe) {
    return this.request('/recipes', { method: 'POST', body: recipe });
  }
  // PUBLIC_INTERFACE
  updateRecipe(id, recipe) {
    return this.request(`/recipes/${encodeURIComponent(id)}`, { method: 'PUT', body: recipe });
  }
  // PUBLIC_INTERFACE
  deleteRecipe(id) {
    return this.request(`/recipes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  // Todos
  // PUBLIC_INTERFACE
  listTodos() {
    // Use the instance's request method; avoid global 'self'
    return this.request('/todos', { method: 'GET' });
  }
  // PUBLIC_INTERFACE
  createTodo(todo) {
    return this.request('/todos', { method: 'POST', body: todo });
  }
  // PUBLIC_INTERFACE
  updateTodo(id, todo) {
    return this.request(`/todos/${encodeURIComponent(id)}`, { method: 'PUT', body: todo });
  }
  // PUBLIC_INTERFACE
  deleteTodo(id) {
    return this.request(`/todos/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
}
