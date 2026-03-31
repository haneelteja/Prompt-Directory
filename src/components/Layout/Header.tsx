import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <span className="text-[var(--color-accent)]">◆</span>
            Prompt Directory
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              All Prompts
            </Link>
            <Link
              to="/new"
              className="text-sm px-3 py-1.5 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              + New Prompt
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-[var(--color-border)]">
              {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) && (
                <img
                  src={user.user_metadata.avatar_url || user.user_metadata.picture}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              )}
              <span className="text-sm text-[var(--color-text-muted)] max-w-[140px] truncate" title={user?.email ?? ''}>
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
