import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'daymark-todos';
const FILTERS = ['All', 'Active', 'Completed'];

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

export default function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState(loadTodos);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  function handleAddTodo(event) {
    event.preventDefault();
    const title = newTodo.trim();
    if (!title) return;

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
    setNewTodo('');
  }

  function toggleTodo(id) {
    setTodos((currentTodos) => currentTodos.map((todo) => (
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )));
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    if (editingTodoId === id) setEditingTodoId(null);
  }

  function startEditing(todo) {
    if (todo.completed) return;
    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
    setEditError('');
  }

  function saveEditedTodo(event, id) {
    event.preventDefault();
    const title = editedTitle.trim();

    if (!title) {
      setEditError('Task title cannot be empty.');
      return;
    }

    setTodos((currentTodos) => currentTodos.map((todo) => (
      todo.id === id && !todo.completed ? { ...todo, title } : todo
    )));
    setEditingTodoId(null);
    setEditError('');
  }

  function cancelEditing() {
    setEditingTodoId(null);
    setEditedTitle('');
    setEditError('');
  }

  return (
    <main className="todo-page">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Daymark home">
          <span className="wordmark-mark" aria-hidden="true">d</span>
          daymark
        </a>
        <button className="button button-quiet logout-button" onClick={onLogout} type="button">
          Sign out <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="todo-content" aria-labelledby="todo-title">
        <div className="todo-heading">
          <p className="eyebrow">{today}</p>
          <h1 id="todo-title">{greeting},<br />let’s make today count.</h1>
          <p className="todo-subtitle">A clear mind starts with one small next step.</p>
          <div className="progress-card" aria-label={`${completedCount} of ${todos.length} tasks completed`}>
            <div className="progress-copy"><span>Your daily progress</span><strong>{todos.length ? Math.round((completedCount / todos.length) * 100) : 0}%</strong></div>
            <div className="progress-track" aria-hidden="true"><span style={{ width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%` }} /></div>
            <p>{todos.length ? `${completedCount} of ${todos.length} tasks complete. Keep your rhythm.` : 'Your day is yours to shape. Start with one small thing.'}</p>
          </div>
        </div>

        <form className="add-form" onSubmit={handleAddTodo}>
          <label className="visually-hidden" htmlFor="new-todo">Add a task</label>
          <span aria-hidden="true" className="add-plus">+</span>
          <input
            id="new-todo"
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="What would you like to get done?"
            value={newTodo}
          />
          <button className="button button-primary add-button" type="submit">Add task</button>
        </form>

        <div className="list-toolbar">
          <div aria-label="Filter tasks" className="filter-tabs" role="group">
            {FILTERS.map((filterName) => (
              <button
                aria-pressed={filter === filterName}
                className={`filter-button${filter === filterName ? ' is-selected' : ''}`}
                key={filterName}
                onClick={() => setFilter(filterName)}
                type="button"
              >
                {filterName}
              </button>
            ))}
          </div>
          <p className="remaining-count" aria-live="polite">
            <strong>{remainingCount}</strong> {remainingCount === 1 ? 'task' : 'tasks'} left
          </p>
        </div>

        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li className={`todo-item${todo.completed ? ' is-completed' : ''}`} key={todo.id}>
              <label className={`todo-label${editingTodoId === todo.id ? ' is-editing' : ''}`}>
                <input
                  checked={todo.completed}
                  disabled={editingTodoId === todo.id}
                  onChange={() => toggleTodo(todo.id)}
                  type="checkbox"
                />
                <span className="custom-check" aria-hidden="true" />
                {editingTodoId !== todo.id && <span className="todo-title">{todo.title}</span>}
              </label>
              {editingTodoId === todo.id ? (
                <form className="edit-form" onSubmit={(event) => saveEditedTodo(event, todo.id)}>
                  <input
                    aria-describedby={editError ? `edit-error-${todo.id}` : undefined}
                    aria-invalid={Boolean(editError)}
                    aria-label={`Edit ${todo.title}`}
                    autoFocus
                    onChange={(event) => {
                      setEditedTitle(event.target.value);
                      if (editError) setEditError('');
                    }}
                    value={editedTitle}
                  />
                  <button className="button button-primary edit-save" type="submit">Save</button>
                  <button className="button button-quiet edit-cancel" onClick={cancelEditing} type="button">Cancel</button>
                  {editError && <p className="form-error edit-error" id={`edit-error-${todo.id}`} role="alert">{editError}</p>}
                </form>
              ) : (
                <div className="todo-actions">
                  {!todo.completed && (
                    <button
                      aria-label={`Edit ${todo.title}`}
                      className="edit-button"
                      onClick={() => startEditing(todo)}
                      type="button"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    aria-label={`Delete ${todo.title}`}
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    type="button"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {visibleTodos.length === 0 && (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">✳</span>
            <p>{todos.length === 0 ? 'A fresh page.' : `No ${filter.toLowerCase()} tasks.`}</p>
            <span>{todos.length === 0 ? 'Add one small thing to begin.' : 'Try another filter or add a new task.'}</span>
          </div>
        )}

        <footer className="list-footer">
          <span className="footer-rule" aria-hidden="true" />
          <span>One thing at a time.</span>
          <span className="footer-rule" aria-hidden="true" />
        </footer>
      </section>
    </main>
  );
}
