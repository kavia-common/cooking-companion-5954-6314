import React, { useEffect, useState } from 'react';
import { useApi } from '../../services/ApiContext';

const emptyRecipe = {
  title: '',
  description: '',
  ingredients: [''],
  steps: [''],
  tags: [],
};

// PUBLIC_INTERFACE
export function RecipeEditor({ recipe, onCancel, onSaved }) {
  /**
   * RecipeEditor allows creating or editing recipes.
   * recipe: optional existing recipe object
   * onCancel: callback when user cancels
   * onSaved: callback after successful save
   */
  const isEditing = !!(recipe && recipe.id);
  const api = useApi();
  const [form, setForm] = useState(emptyRecipe);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (recipe) {
      setForm({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length ? recipe.ingredients : [''],
        steps: Array.isArray(recipe.steps) && recipe.steps.length ? recipe.steps : [''],
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
      });
    } else {
      setForm(emptyRecipe);
    }
  }, [recipe]);

  const updateField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const updateArrayItem = (key, idx, value) => {
    setForm(prev => {
      const arr = [...prev[key]];
      arr[idx] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key) => {
    setForm(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const removeArrayItem = (key, idx) => {
    setForm(prev => {
      const arr = prev[key].filter((_, i) => i !== idx);
      return { ...prev, [key]: arr.length ? arr : [''] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.title.trim()) {
      setErr('Title is required.');
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.map(s => s.trim()).filter(Boolean),
      steps: form.steps.map(s => s.trim()).filter(Boolean),
      tags: form.tags.map(t => t.trim()).filter(Boolean),
    };
    setSaving(true);
    try {
      if (isEditing) {
        await api.updateRecipe(recipe.id, payload);
      } else {
        await api.createRecipe(payload);
      }
      onSaved?.();
    } catch (e1) {
      setErr(e1.message || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{isEditing ? 'Edit Recipe' : 'New Recipe'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={btnStyles.ghost}>Cancel</button>
          <button onClick={handleSubmit} style={btnStyles.primary} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>
      {err && <div style={formStyles.error} role="alert">{err}</div>}
      <form onSubmit={handleSubmit} style={formStyles.form}>
        <label style={formStyles.label}>
          Title
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            style={formStyles.input}
            placeholder="e.g., Classic Tomato Pasta"
          />
        </label>
        <label style={formStyles.label}>
          Description
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            style={formStyles.textarea}
            placeholder="Short description of the recipe…"
          />
        </label>

        <fieldset style={formStyles.fieldset}>
          <legend>Ingredients</legend>
          {form.ingredients.map((ing, idx) => (
            <div key={idx} style={formStyles.row}>
              <input
                type="text"
                value={ing}
                onChange={(e) => updateArrayItem('ingredients', idx, e.target.value)}
                style={formStyles.input}
                placeholder="e.g., 200g spaghetti"
              />
              <button type="button" onClick={() => addArrayItem('ingredients')} style={btnStyles.small}>
                + Add
              </button>
              <button type="button" onClick={() => removeArrayItem('ingredients', idx)} style={btnStyles.smallDanger}>
                Remove
              </button>
            </div>
          ))}
        </fieldset>

        <fieldset style={formStyles.fieldset}>
          <legend>Steps</legend>
          {form.steps.map((st, idx) => (
            <div key={idx} style={formStyles.row}>
              <input
                type="text"
                value={st}
                onChange={(e) => updateArrayItem('steps', idx, e.target.value)}
                style={formStyles.input}
                placeholder="e.g., Boil pasta in salted water"
              />
              <button type="button" onClick={() => addArrayItem('steps')} style={btnStyles.small}>
                + Add
              </button>
              <button type="button" onClick={() => removeArrayItem('steps', idx)} style={btnStyles.smallDanger}>
                Remove
              </button>
            </div>
          ))}
        </fieldset>

        <label style={formStyles.label}>
          Tags (comma separated)
          <input
            type="text"
            value={form.tags.join(', ')}
            onChange={(e) => updateField('tags', e.target.value.split(',').map(s => s.trim()))}
            style={formStyles.input}
            placeholder="e.g., pasta, vegetarian, quick"
          />
        </label>
      </form>
    </section>
  );
}

const formStyles = {
  form: {
    display: 'grid',
    gap: 12,
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    display: 'grid',
    gap: 6,
    color: 'var(--text-primary)',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    resize: 'vertical',
  },
  fieldset: {
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: 12,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 8,
  },
};

const btnStyles = {
  primary: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  small: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  smallDanger: {
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
