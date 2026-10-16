import React, { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import TodoPage from './TodoPage.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <TodoPage onLogout={() => setIsLoggedIn(false)} />
  ) : (
    <LoginPage onLogin={() => setIsLoggedIn(true)} />
  );
}