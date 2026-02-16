import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { NewPromptPage } from '@/pages/NewPromptPage';
import { EditPromptPage } from '@/pages/EditPromptPage';
import { PromptDetail } from '@/components/prompts/PromptDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new" element={<NewPromptPage />} />
          <Route path="prompt/:id" element={<PromptDetail />} />
          <Route path="prompt/:id/edit" element={<EditPromptPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
