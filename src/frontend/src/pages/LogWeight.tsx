import { useState } from 'react';
import { useGetAllExercises, useLogWeightEntry } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { capitalizeText } from '../utils/formatting';
import type { Exercise } from '../backend';

export default function LogWeight() {
  const { data: exercises, isLoading } = useGetAllExercises();
  const logMutation = useLogWeightEntry();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExercise || !weight || !reps || !sets) {
      toast.error('Please fill in all fields');
      return;
    }

    const exerciseIndex = parseInt(selectedExercise);
    if (isNaN(exerciseIndex) || !exercises || exerciseIndex >= exercises.length) {
      toast.error('Invalid exercise selection');
      return;
    }

    try {
      await logMutation.mutateAsync({
        exerciseId: BigInt(exerciseIndex),
        weight: BigInt(weight),
        reps: BigInt(reps),
        sets: BigInt(sets),
        workoutId: null,
      });

      setShowSuccess(true);
      toast.success('Weight entry logged successfully!');

      // Reset form
      setWeight('');
      setReps('');
      setSets('');

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to log weight entry');
    }
  };

  const selectedExerciseData = selectedExercise ? exercises?.[parseInt(selectedExercise)] : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Log Weight</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your workout performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Weight Entry</CardTitle>
          <CardDescription>Record your sets, reps, and weight for an exercise</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                <SelectTrigger id="exercise">
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {exercises?.map((exercise, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{exercise.name}</span>
                        <span className="text-xs text-muted-foreground">
                          • {capitalizeText(exercise.muscleGroup)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedExerciseData && (
                <div className="flex gap-2 pt-1">
                  <Badge variant="outline" className="text-xs">
                    {selectedExerciseData.equipmentType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {capitalizeText(selectedExerciseData.muscleGroup)}
                  </Badge>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="135"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={logMutation.isPending}>
              {logMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Logged!
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Entry
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
