import { useNavigate } from '@tanstack/react-router';
import { useGetAllWorkouts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, Dumbbell } from 'lucide-react';

export default function WorkoutsList() {
  const navigate = useNavigate();
  const { data: workouts, isLoading } = useGetAllWorkouts();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">My Workouts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create and manage your workout routines</p>
        </div>
        <Button onClick={() => navigate({ to: '/workouts/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Workout
        </Button>
      </div>

      {!workouts || workouts.length === 0 ? (
        <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-dashed border-border p-8">
          <div className="text-center">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No workouts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first workout to get started</p>
            <Button className="mt-4" onClick={() => navigate({ to: '/workouts/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workout
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <Card
              key={workout.id.toString()}
              className="cursor-pointer transition-colors hover:border-primary"
              onClick={() => navigate({ to: `/workouts/${workout.id.toString()}` })}
            >
              <CardHeader>
                <CardTitle className="font-display">{workout.name}</CardTitle>
                <CardDescription>
                  {workout.exerciseIds.length} exercise{workout.exerciseIds.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(Number(workout.createdAt) / 1000000).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
