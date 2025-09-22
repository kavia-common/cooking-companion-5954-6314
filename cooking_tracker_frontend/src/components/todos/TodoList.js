import React, { useEffect, useState } from 'react';
import { useApi } from '../../services/ApiContext';

// PUBLIC_INTERFACE
export function TodoList() {
  /**
   * Displays cooking-related todo items, allowing creation, completion toggle, edit and delete.
   */
  const api = useApi();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [newText, setNewText] = useState('');

  const loadTodos = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await api.listTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    try {
      await api.createTodo({ text, done: false });
      setNewText('');
      await loadTodos();
    } catch (e1) {
      alert(e1.message || 'Failed to add todo');
    }
  };

  const toggleDone = async (todo) => {
    try {
      await api.updateTodo(todo.id, { ...todo, done: !todo.done });
      await loadTodos();
    } catch (e) {
      alert(e.message || 'Failed to update todo');
    }
  };

  const updateText = async (todo, text) => {
    try {
      await api.updateTodo(todo.id, { ...todo, text });
      await loadTodos();
    } catch (e) {
      alert(e.message || 'Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      await loadTodos();
    } catch (e) {
      alert(e.message || 'Failed to delete todo');
    }
  };

  return (
    <section>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Cooking Todos</h2>
        <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="e.g., Thaw chicken, preheat oven…"
            style={styles.input}
          />
          <button type="submit" style={styles.primaryBtn}>Add</button>
        </form>
      </header>
      {loading && <div style={styles.info}>Loading todos…</div>}
      {err && <div style={styles.error} role="alert">{err}</div>}
      <ul style={styles.list}>
        {todos.map((t) => (
          <li key={t.id} style={styles.item}>
            <label style={styles.row}>
              <input type="checkbox" checked={!!t.done} onChange={() => toggleDone(t)} />
              <EditableText
                value={t.text}
                onChange={(v) => updateText(t, v)}
                style={{
                  ...styles.text,
                  textDecoration: t.done ? 'line-through' : 'none',
                  opacity: t.done ? 0.6 : 1,
                }}
              />
            </label>
            <button onClick={() => deleteTodo(t.id)} style={styles.dangerBtn}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditableText({ value, onChange, style }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  useEffect(() => setVal(value), [value]);

  if (!editing) {
    return (
      <span style={{ ...style, cursor: 'text' }} onClick={() => setEditing(true)} title="Click to edit">
        {value}
      </span>
    );
  }
  return (
    <input
      autoFocus
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (val.trim() !== value.trim()) onChange(val.trim());
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          setVal(value);
          setEditing(false);
        }
      }}
      style={styles.editInput}
    />
  );
}

const styles = {
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    minWidth: 260,
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
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 8,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: 12,
    background: 'var(--bg-secondary)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  text: {
    color: 'var(--text-primary)',
  },
  editInput: {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    width: '100%',
  },
  info: { color: 'var(--text-primary)', marginBottom: 8 },
  error: { color: '#ff6b6b', marginBottom: 8 },
  dangerBtn: {
    background: '#c0392b',
    border: 'none',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
