import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { RecipeList } from './components/recipes/RecipeList';
import { RecipeEditor } from './components/recipes/RecipeEditor';
import { TodoList } from './components/todos/TodoList';
import { ApiProvider } from './services/ApiContext';
import { useLocalStorage } from './hooks/useLocalStorage';

/**
 * App: Main entry for the Cooking Companion frontend. Provides:
 * - Global theme toggle (persists in localStorage)
 * - Simple in-app routing between Recipes and Todos
 * - ApiProvider for backend communication, configured via environment variables
 */

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [route, setRoute] = useState('recipes'); // 'recipes' | 'todos' | 'new-recipe' | 'edit-recipe'
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const apiBaseUrl = useMemo(() => {
    // Use REACT_APP_API_BASE if set, else default to /api so it can be proxied
    return process.env.REACT_APP_API_BASE || '/api';
  }, []);

  const handleNavigate = (to) => setRoute(to);

  const onCreateRecipe = () => {
    setEditingRecipe(null);
    setRoute('new-recipe');
  };

  const onEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setRoute('edit-recipe');
  };

  const onSavedRecipe = () => {
    setEditingRecipe(null);
    setRoute('recipes');
  };

  return (
    <ApiProvider baseUrl={apiBaseUrl}>
      <div className="App">
        <header className="App-header" style={{ minHeight: 'auto', paddingTop: 72 }}>
          <TopNav
            theme={theme}
            onToggleTheme={toggleTheme}
            route={route}
            onNavigate={handleNavigate}
          />
        </header>

        <main style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
          {route === 'recipes' && (
            <RecipeList onCreate={onCreateRecipe} onEdit={onEditRecipe} />
          )}
          {(route === 'new-recipe' || route === 'edit-recipe') && (
            <RecipeEditor
              recipe={editingRecipe}
              onCancel={() => setRoute('recipes')}
              onSaved={onSavedRecipe}
            />
          )}
          {route === 'todos' && <TodoList />}
        </main>

        <footer style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>
          Cooking Companion • Manage your recipes and cooking tasks
        </footer>
      </div>
    </ApiProvider>
  );
}

function TopNav({ theme, onToggleTheme, route, onNavigate }) {
  return (
    <nav className="navbar" style={navStyles.container}>
      <div style={navStyles.brand}>Cooking Companion</div>
      <div style={navStyles.links}>
        <button
          type="button"
          onClick={() => onNavigate('recipes')}
          style={{
            ...navStyles.linkBtn,
            ...(route === 'recipes' ? navStyles.linkActive : {}),
          }}
        >
          Recipes
        </button>
        <button
          type="button"
          onClick={() => onNavigate('todos')}
          style={{
            ...navStyles.linkBtn,
            ...(route === 'todos' ? navStyles.linkActive : {}),
          }}
        >
          Cooking Todos
        </button>
      </div>
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
}

const navStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 5,
  },
  brand: {
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text-primary)',
  },
  links: {
    display: 'flex',
    gap: 8,
  },
  linkBtn: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  linkActive: {
    borderColor: 'var(--text-secondary)',
    boxShadow: '0 0 0 1px var(--text-secondary) inset',
  },
};

export default App;
