import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllExercises, useCreateWorkout, useUpdateWorkout, useGetWorkout } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Plus, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { capitalizeText } from '../utils/formatting';
import type { Exercise } from '../backend';

export default function WorkoutForm() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const isEditMode = !!id;
  const workoutId = id ? BigInt(id) : null;

  const { data: workout, isLoading: workoutLoading } = useGetWorkout(workoutId);
  const { data: exercises, isLoading: exercisesLoading } = useGetAllExercises();
  const createMutation = useCreateWorkout();
  const updateMutation = useUpdateWorkout();

  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (workout && exercises) {
      setName(workout.name);
      setSelectedExercises(workout.exerciseIds.map((id) => Number(id)));
    }
  }, [workout, exercises]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a workout name');
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    try {
      if (isEditMode && workoutId) {
        await updateMutation.mutateAsync({
          id: workoutId,
          name,
          exerciseIds: selectedExercises.map((id) => BigInt(id)),
        });
        toast.success('Workout updated successfully!');
      } else {
        await createMutation.mutateAsync({
          name,
          exerciseIds: selectedExercises.map((id) => BigInt(id)),
        });
        toast.success('Workout created successfully!');
      }
      navigate({ to: '/workouts' });
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} workout`);
    }
  };

  const toggleExercise = (index: number) => {
    setSelectedExercises((prev) =>
      prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
    );
  };

  const filteredExercises = exercises?.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (exercisesLoading || (isEditMode && workoutLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/workouts' })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workouts
      </Button>

      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {isEditMode ? 'Edit Workout' : 'Create Workout'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEditMode ? 'Update your workout routine' : 'Build a custom workout routine'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Upper Body Day"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Exercises</CardTitle>
            <CardDescription>
              {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedExercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">No exercises selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedExercises.map((index) => {
                  const exercise = exercises?.[index];
                  if (!exercise) return null;
                  return (
                    <Badge key={index} variant="secondary" className="gap-1 pr-1">
                      {exercise.name}
                      <button
                        type="button"
                        onClick={() => toggleExercise(index)}
                        className="ml-1 rounded-sm hover:bg-accent"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Exercises</CardTitle>
            <CardDescription>Search and select exercises to add to your workout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search exercises..."
                className="pl-9"
              />
            </div>

            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {filteredExercises?.map((exercise, index) => {
                const isSelected = selectedExercises.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleExercise(index)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                          <span>{exercise.equipmentType}</span>
                          <span>•</span>
                          <span>{capitalizeText(exercise.muscleGroup)}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Plus className="h-4 w-4 rotate-45" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Workout' : 'Create Workout'}</>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/workouts' })}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
