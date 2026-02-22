import { Link, useRouterState } from '@tanstack/react-router';
import { Dumbbell, ListChecks, TrendingUp, Plus } from 'lucide-react';

export default function Navigation() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActive = (path: string) => {
    if (path === '/exercises' && currentPath === '/') return true;
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/exercises" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">FitTrack Pro</span>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link
              to="/exercises"
              className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/exercises')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
              }`}
            >
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Exercises</span>
            </Link>

            <Link
              to="/workouts"
              className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/workouts')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
              }`}
            >
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Workouts</span>
            </Link>

            <Link
              to="/log-weight"
              className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/log-weight')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Log</span>
            </Link>

            <Link
              to="/progress"
              className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/progress')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
