import { Link } from '@tanstack/react-router';
import { Dumbbell, ListChecks, Plus, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      title: 'Exercise Library',
      description: 'Browse and manage your complete exercise database with filtering options',
      icon: Dumbbell,
      link: '/exercises',
      color: 'text-chart-1',
    },
    {
      title: 'Workouts',
      description: 'Create and organize custom workout routines from your exercise library',
      icon: ListChecks,
      link: '/workouts',
      color: 'text-chart-2',
    },
    {
      title: 'Log Weight',
      description: 'Track your weight, reps, and sets for every exercise session',
      icon: Plus,
      link: '/log-weight',
      color: 'text-chart-3',
    },
    {
      title: 'Progress',
      description: 'Monitor your strength gains and performance trends over time',
      icon: TrendingUp,
      link: '/progress',
      color: 'text-chart-4',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <Dumbbell className="h-12 w-12 text-primary-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            FitTrack Pro
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Your complete fitness tracking solution. Build custom workouts, log your progress, and
            watch your strength grow with comprehensive exercise management.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight">
          Everything You Need to Track Your Fitness
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} to={feature.link}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader>
                    <div className={`mb-2 ${feature.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="rounded-lg border border-border bg-card p-8">
        <div className="space-y-4 text-center">
          <h3 className="font-display text-2xl font-bold">Ready to Start Your Journey?</h3>
          <p className="text-muted-foreground">
            Begin by exploring the exercise library or creating your first workout routine.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/exercises"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Exercises
            </Link>
            <Link
              to="/workouts"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Create Workout
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} FitTrack Pro. Built with{' '}
          <Heart className="inline h-4 w-4 text-destructive" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'fittrack-pro'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
