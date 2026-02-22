import { useState } from 'react';
import { useGetAllExercises, useGetWeightProgress } from '../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WeightEntry } from '../backend';

export default function WeightProgress() {
  const { data: exercises, isLoading: exercisesLoading } = useGetAllExercises();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const exerciseId = selectedExercise ? BigInt(selectedExercise) : null;
  const { data: entries, isLoading: entriesLoading } = useGetWeightProgress(exerciseId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTrend = (current: WeightEntry, previous: WeightEntry | undefined) => {
    if (!previous) return null;
    const currentWeight = Number(current.weight);
    const previousWeight = Number(previous.weight);

    if (currentWeight > previousWeight) {
      return { type: 'up', diff: currentWeight - previousWeight };
    } else if (currentWeight < previousWeight) {
      return { type: 'down', diff: previousWeight - currentWeight };
    }
    return { type: 'same', diff: 0 };
  };

  if (exercisesLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Weight Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your strength gains over time</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Exercise</label>
        <Select value={selectedExercise} onValueChange={setSelectedExercise}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Choose an exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises?.map((exercise, index) => (
              <SelectItem key={index} value={index.toString()}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedExercise && (
        <>
          {entriesLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} recorded
              </div>
              <div className="space-y-3">
                {entries.map((entry, index) => {
                  const trend = getTrend(entry, entries[index + 1]);
                  return (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">{formatDate(entry.date)}</div>
                            {trend && (
                              <Badge
                                variant="outline"
                                className={
                                  trend.type === 'up'
                                    ? 'bg-chart-3/20 text-chart-3 border-chart-3/30'
                                    : trend.type === 'down'
                                      ? 'bg-destructive/20 text-destructive border-destructive/30'
                                      : 'bg-muted'
                                }
                              >
                                {trend.type === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                                {trend.type === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                                {trend.type === 'same' && <Minus className="mr-1 h-3 w-3" />}
                                {trend.diff > 0 && `${trend.diff} lbs`}
                                {trend.diff === 0 && 'Same'}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-baseline gap-4">
                            <div>
                              <span className="font-display text-2xl font-bold text-primary">
                                {entry.weight.toString()}
                              </span>
                              <span className="ml-1 text-sm text-muted-foreground">lbs</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.sets.toString()} sets × {entry.reps.toString()} reps
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed border-border p-8">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No entries yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Start logging weights to track your progress</p>
              </div>
            </div>
          )}
        </>
      )}

      {!selectedExercise && (
        <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed border-border p-8">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">Select an exercise</p>
            <p className="mt-1 text-sm text-muted-foreground">Choose an exercise to view your progress history</p>
          </div>
        </div>
      )}
    </div>
  );
}
