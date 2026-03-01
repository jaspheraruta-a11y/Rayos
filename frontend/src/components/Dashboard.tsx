import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../routes';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.login, { replace: true });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <nav className="bg-white shadow-sm border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8 mb-8">
          <h2 className="text-3xl font-bold text-surface-900 mb-2">
            Welcome to Your Dashboard!
          </h2>
          <p className="text-surface-600 mb-8">Here's your account information</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-6 border border-brand-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-600 p-2 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">User ID</h3>
              </div>
              <p className="text-sm text-surface-600 font-mono break-all">{user?.id}</p>
            </div>

            <div className="bg-gradient-to-br from-brand-50 to-surface-100 rounded-xl p-6 border border-surface-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-500 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">Email</h3>
              </div>
              <p className="text-sm text-surface-700">{user?.email}</p>
            </div>

            <div className="bg-gradient-to-br from-surface-50 to-surface-100 rounded-xl p-6 border border-surface-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-600 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">Account Created</h3>
              </div>
              <p className="text-sm text-surface-700">
                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-50 to-surface-100 rounded-xl p-6 border border-surface-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-700 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">Last Sign In</h3>
              </div>
              <p className="text-sm text-surface-700">
                {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8">
          <h3 className="text-2xl font-bold text-surface-900 mb-4">Getting Started</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-surface-900">Authentication Complete</h4>
                <p className="text-surface-600 text-sm">You've successfully logged in with your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-surface-900">Secure Session</h4>
                <p className="text-surface-600 text-sm">Your session is stored securely</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-surface-900">Build Your App</h4>
                <p className="text-surface-600 text-sm">Start adding features and functionality to your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
