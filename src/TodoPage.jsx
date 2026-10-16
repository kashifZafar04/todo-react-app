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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
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
          <p className="eyebrow">Your personal list</p>
          <h1 id="todo-title">Today, at your pace.</h1>
          <p className="todo-subtitle">A clear mind starts with one small next step.</p>
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
              <label className="todo-label">
                <input
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  type="checkbox"
                />
                <span className="custom-check" aria-hidden="true" />
                <span className="todo-title">{todo.title}</span>
              </label>
              <button
                aria-label={`Delete ${todo.title}`}
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>
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