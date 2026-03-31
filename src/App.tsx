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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
