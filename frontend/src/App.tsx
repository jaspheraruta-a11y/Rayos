import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ROUTES } from './routes';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-surface-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Home: redirect to dashboard if logged in, else to login */}
      <Route
        path={ROUTES.home}
        element={
          user ? <Navigate to={ROUTES.dashboard} replace /> : <Navigate to={ROUTES.login} replace />
        }
      />
      {/* Login page — sign in form */}
      <Route path={ROUTES.login} element={<LoginForm />} />
      {/* Signup page — create account form */}
      <Route path={ROUTES.signup} element={<SignupForm />} />
      {/* Dashboard — protected, redirect to login if not authenticated */}
      <Route
        path={ROUTES.dashboard}
        element={user ? <Dashboard /> : <Navigate to={ROUTES.login} replace />}
      />
      {/* Catch-all: send unknown paths to login */}
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
