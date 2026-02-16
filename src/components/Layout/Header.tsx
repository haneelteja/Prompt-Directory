import { Link } from 'react-router-dom';

export function Header() {
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
          </nav>
        </div>
      </div>
    </header>
  );
}
