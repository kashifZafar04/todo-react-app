import React, { useState } from 'react';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password do not match. Try the demo account below.');
      return;
    }

    onLogin();
  }

  function fillDemoCredentials() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <a className="wordmark" href="#home" aria-label="Daymark home">
          <span className="wordmark-mark" aria-hidden="true">d</span>
          daymark
        </a>

        <div className="login-copy">
          <p className="eyebrow">A little more done</p>
          <h1 id="login-title">Make room for what matters.</h1>
          <p className="login-description">Sign in to your personal space and get today moving.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <button className="button button-quiet autofill-button" onClick={fillDemoCredentials} type="button">
            Fill demo account
          </button>
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="username"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type="password"
            value={password}
          />

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="button button-primary login-submit" type="submit">
            Sign in <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="demo-note">
          <span className="demo-dot" aria-hidden="true" />
          Demo account <strong>student@example.com</strong> · password <strong>password123</strong>
        </p>
      </section>
      <aside className="login-art" aria-label="A calm moment to plan your day">
        <div className="art-sun" aria-hidden="true" />
        <div className="art-note">
          <span className="art-note-label">A thought for today</span>
          <p>Small steps, taken often, make a life.</p>
          <span className="art-note-line" aria-hidden="true" />
        </div>
        <span className="art-caption">YOUR DAY, WITH A LITTLE MORE INTENTION.</span>
      </aside>
    </main>
  );
}
