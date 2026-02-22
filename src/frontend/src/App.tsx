import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Navigation from './components/Navigation';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutsList from './pages/WorkoutsList';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutForm from './pages/WorkoutForm';
import LogWeight from './pages/LogWeight';
import WeightProgress from './pages/WeightProgress';
import { Toaster } from '@/components/ui/sonner';

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ExerciseLibrary,
});

const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercises',
  component: ExerciseLibrary,
});

const workoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workouts',
  component: WorkoutsList,
});

const workoutDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workouts/$id',
  component: WorkoutDetail,
});

const workoutNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workouts/new',
  component: WorkoutForm,
});

const workoutEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workouts/edit/$id',
  component: WorkoutForm,
});

const logWeightRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log-weight',
  component: LogWeight,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: WeightProgress,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  exercisesRoute,
  workoutsRoute,
  workoutDetailRoute,
  workoutNewRoute,
  workoutEditRoute,
  logWeightRoute,
  progressRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
