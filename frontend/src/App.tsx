import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SessionsPage } from './pages/SessionsPage';
import { SessionFormPage } from './pages/SessionFormPage';
import { PlansPage } from './pages/PlansPage';
import { CalendarPage } from './pages/CalendarPage';

export const App: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');
  const [isCreating, setIsCreating] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'plans' | 'calendar'>('sessions');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <header
        style={{
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Exercise Progress Tracker</h1>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>
              Kirjautuneena: <strong>{user?.display_name}</strong>
            </span>
            <button
              onClick={logout}
              style={{
                padding: '6px 14px',
                cursor: 'pointer',
                borderRadius: 4,
                border: '1px solid #ccc',
                background: '#fff',
              }}
            >
              Kirjaudu ulos
            </button>
          </div>
        ) : (
          <button
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            style={{
              padding: '6px 14px',
              cursor: 'pointer',
              borderRadius: 4,
              border: '1px solid #1a73e8',
              background: '#fff',
              color: '#1a73e8',
              fontWeight: 500,
            }}
          >
            {view === 'login' ? 'Siirry rekisteröitymiseen' : 'Siirry kirjautumiseen'}
          </button>
        )}
      </header>

      <main>
        {isAuthenticated ? (
          <div>
            {!isCreating && !editingSessionId && (
              <nav
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  borderBottom: '2px solid #eee',
                  paddingBottom: '0.5rem',
                }}
              >
                <button
                  onClick={() => setActiveTab('sessions')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'sessions' ? '3px solid #0d6efd' : '3px solid transparent',
                    padding: '0.5rem 1rem',
                    fontWeight: activeTab === 'sessions' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    color: activeTab === 'sessions' ? '#0d6efd' : '#333',
                    fontSize: '1rem',
                  }}
                >
                  Harjoitussessiot
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'plans' ? '3px solid #0d6efd' : '3px solid transparent',
                    padding: '0.5rem 1rem',
                    fontWeight: activeTab === 'plans' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    color: activeTab === 'plans' ? '#0d6efd' : '#333',
                    fontSize: '1rem',
                  }}
                >
                  Suunnitelmat (Plans)
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'calendar' ? '3px solid #0d6efd' : '3px solid transparent',
                    padding: '0.5rem 1rem',
                    fontWeight: activeTab === 'calendar' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    color: activeTab === 'calendar' ? '#0d6efd' : '#333',
                    fontSize: '1rem',
                  }}
                >
                  Kalenteri (Calendar)
                </button>
              </nav>
            )}

            {isCreating || editingSessionId ? (
              <SessionFormPage
                sessionId={editingSessionId}
                onSaved={() => {
                  setIsCreating(false);
                  setEditingSessionId(null);
                }}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingSessionId(null);
                }}
                onDeleted={() => {
                  setIsCreating(false);
                  setEditingSessionId(null);
                }}
                onCloned={() => {
                  setEditingSessionId(null);
                  setIsCreating(false);
                  setActiveTab('sessions');
                }}
              />
            ) : activeTab === 'plans' ? (
              <PlansPage onSelectSession={(id) => setEditingSessionId(id)} />
            ) : activeTab === 'calendar' ? (
              <CalendarPage onSelectSession={(id) => setEditingSessionId(id)} />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setIsCreating(true)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1a73e8',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    + Luo uusi sessio
                  </button>
                </div>
                <SessionsPage onSelectSession={(id) => setEditingSessionId(id)} />
              </div>
            )}
          </div>
        ) : view === 'login' ? (
          <LoginPage />
        ) : (
          <RegisterPage />
        )}
      </main>
    </div>
  );
};

export default App;