import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetWorkout } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function WorkoutDetail() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const workoutId = id ? BigInt(id) : null;
  const { data: workout, isLoading } = useGetWorkout(workoutId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/workouts' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Workout not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/workouts' })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workouts
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">{workout.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {workout.exerciseIds.length} exercise{workout.exerciseIds.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
