import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ToastContainer } from '../Toast';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
