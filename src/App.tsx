import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { NewPromptPage } from '@/pages/NewPromptPage';
import { EditPromptPage } from '@/pages/EditPromptPage';
import { PromptDetail } from '@/components/prompts/PromptDetail';
import { LoginPage } from '@/pages/LoginPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { AuthDesktopPage } from '@/pages/AuthDesktopPage';
import { HealthPage } from '@/pages/HealthPage';
import { env } from '@/config/env';

function MissingEnvPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-lg">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-3">Setup Required</p>
        <h1 className="text-2xl font-bold mb-3">Missing Vercel environment variables</h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          This build was deployed without the required Supabase configuration, so the app cannot start yet.
        </p>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 mb-6">
          <p className="text-sm font-medium mb-2">Add these variables in Vercel:</p>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            {env.missingSupabaseEnvKeys.map((key) => (
              <li key={key} className="font-mono text-[var(--color-text)]">
                {key}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-[var(--color-text-muted)] space-y-2">
          <p>Set them in Project Settings → Environment Variables, then redeploy the app.</p>
          <p>`VITE_APP_URL` is optional for web mode and only needed for the desktop/cloud auth handoff.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  if (!env.hasSupabaseConfig) {
    return <MissingEnvPage />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/health" element={<HealthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/desktop" element={<AuthDesktopPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="new" element={<NewPromptPage />} />
            <Route path="prompt/:id" element={<PromptDetail />} />
            <Route path="prompt/:id/edit" element={<EditPromptPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
