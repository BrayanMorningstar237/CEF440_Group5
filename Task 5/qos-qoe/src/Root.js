import { useEffect, useState } from 'react';

import { LoadingScreen } from './components/LoadingScreen';
import { clearSession, loadSession } from './services/storage';
import { AdminApp } from './screens/AdminApp';
import { AuthScreen } from './screens/AuthScreen';
import { UserApp } from './screens/UserApp';

export function Root() {
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadSession()
      .then(setSession)
      .finally(() => setBooting(false));
  }, []);

  async function logout() {
    await clearSession();
    setSession(null);
  }

  function toggleLanguage() {
    setLanguage((current) => (current === 'en' ? 'fr' : 'en'));
  }

  if (booting) return <LoadingScreen text="Starting app" />;
  if (!session) {
    return <AuthScreen language={language} onAuthenticated={setSession} onToggleLanguage={toggleLanguage} />;
  }
  if (session.user.role === 'admin') {
    return <AdminApp language={language} onLogout={logout} onToggleLanguage={toggleLanguage} session={session} />;
  }
  return <UserApp language={language} onLogout={logout} onToggleLanguage={toggleLanguage} session={session} />;
}
