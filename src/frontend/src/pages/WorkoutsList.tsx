import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WorkoutsList() {
  const navigate = useNavigate();

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

      <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-dashed border-border p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No workouts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first workout to get started</p>
          <Button className="mt-4" onClick={() => navigate({ to: '/workouts/new' })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workout
          </Button>
        </div>
      </div>
    </div>
  );
}
