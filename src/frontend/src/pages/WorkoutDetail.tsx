import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetWorkout, useGetAllExercises, useDeleteWorkout } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { capitalizeText } from '../utils/formatting';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function WorkoutDetail() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const workoutId = id ? BigInt(id) : null;
  const { data: workout, isLoading: workoutLoading } = useGetWorkout(workoutId);
  const { data: exercises, isLoading: exercisesLoading } = useGetAllExercises();
  const deleteMutation = useDeleteWorkout();

  const handleDelete = async () => {
    if (!workoutId) return;

    try {
      await deleteMutation.mutateAsync(workoutId);
      toast.success('Workout deleted successfully!');
      navigate({ to: '/workouts' });
    } catch (error) {
      toast.error('Failed to delete workout');
    }
  };

  if (workoutLoading || exercisesLoading) {
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

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{workout.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {workout.exerciseIds.length} exercise{workout.exerciseIds.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: `/workouts/${id}/edit` })}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{workout.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {workout.exerciseIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exercises in this workout</p>
          ) : (
            <div className="space-y-3">
              {workout.exerciseIds.map((exerciseId, idx) => {
                const exercise = exercises?.[Number(exerciseId)];
                if (!exercise) {
                  return (
                    <div key={idx} className="rounded-lg border border-border p-4">
                      <p className="text-sm text-muted-foreground">Exercise not found</p>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {exercise.equipmentType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {capitalizeText(exercise.muscleGroup)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
