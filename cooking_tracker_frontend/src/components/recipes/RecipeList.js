import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../../services/ApiContext';

// PUBLIC_INTERFACE
export function RecipeList({ onCreate, onEdit }) {
  /**
   * Displays list of recipes with search, edit and delete actions.
   * onCreate -> open new recipe editor
   * onEdit(recipe) -> open edit for recipe
   */
  const api = useApi();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(r =>
      [r.title, r.description, (r.tags || []).join(' ')].join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [recipes, query]);

  const loadRecipes = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await api.listRecipes();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.deleteRecipe(id);
      await loadRecipes();
    } catch (e) {
      alert(e.message || 'Failed to delete');
    }
  };

  return (
    <section>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={{ margin: 0 }}>Recipes</h2>
          <input
            type="search"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.search}
          />
        </div>
        <button onClick={onCreate} style={styles.primaryBtn} aria-label="Create new recipe">
          + New Recipe
        </button>
      </header>

      {loading && <div style={styles.info}>Loading recipes…</div>}
      {err && <div style={styles.error} role="alert">{err}</div>}
      {!loading && !err && filtered.length === 0 && (
        <div style={styles.empty}>
          <p>No recipes yet.</p>
          <button onClick={onCreate} style={styles.primaryBtn}>Create your first recipe</button>
        </div>
      )}

      <div style={styles.grid}>
        {filtered.map((r) => (
          <article key={r.id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <h3 style={{ margin: 0 }}>{r.title}</h3>
              <span style={styles.badge}>{Array.isArray(r.tags) ? r.tags.join(', ') : ''}</span>
            </div>
            {r.description && <p style={styles.muted}>{r.description}</p>}
            {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
              <div>
                <strong>Ingredients:</strong>
                <ul style={styles.list}>
                  {r.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
              </div>
            )}
            {Array.isArray(r.steps) && r.steps.length > 0 && (
              <div>
                <strong>Steps:</strong>
                <ol style={styles.list}>
                  {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                </ol>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => onEdit(r)} style={styles.outlineBtn}>Edit</button>
              <button onClick={() => onDelete(r.id)} style={styles.dangerBtn}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  search: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  card: {
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: 16,
    background: 'var(--bg-secondary)',
  },
  list: {
    marginTop: 6,
    marginBottom: 6,
  },
  badge: {
    background: 'var(--text-secondary)',
    color: '#000',
    fontSize: 12,
    padding: '2px 6px',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  primaryBtn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  outlineBtn: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  dangerBtn: {
    background: '#c0392b',
    border: 'none',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  empty: {
    border: '1px dashed var(--border-color)',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
    color: 'var(--text-primary)',
  },
  info: { color: 'var(--text-primary)', marginBottom: 8 },
  error: { color: '#ff6b6b', marginBottom: 8 },
  muted: { color: 'var(--text-primary)', opacity: 0.85 },
};
