import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Exercise, Workout, WeightEntry } from '../backend';

export function useGetAllExercises() {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercisesSorted();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterExercisesByEquipment(equipmentType: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises', 'equipment', equipmentType],
    queryFn: async () => {
      if (!actor) return [];
      if (!equipmentType) return actor.getAllExercisesSorted();
      return actor.filterExercisesByEquipmentType(equipmentType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterExercisesByMuscleGroup(muscleGroup: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises', 'muscle', muscleGroup],
    queryFn: async () => {
      if (!actor) return [];
      if (!muscleGroup) return actor.getAllExercisesSorted();
      return actor.filterExercisesByMuscleGroup(muscleGroup);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkout(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Workout | null>({
    queryKey: ['workout', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getWorkout(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, exerciseIds }: { name: string; exerciseIds: bigint[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createWorkout(name, exerciseIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useUpdateWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, exerciseIds }: { id: bigint; name: string; exerciseIds: bigint[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateWorkout(id, name, exerciseIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workout', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useLogWeightEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exerciseId,
      weight,
      reps,
      sets,
      workoutId,
    }: {
      exerciseId: bigint;
      weight: bigint;
      reps: bigint;
      sets: bigint;
      workoutId: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logWeightEntry(exerciseId, weight, reps, sets, workoutId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.exerciseId.toString()] });
    },
  });
}

export function useGetWeightProgress(exerciseId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<WeightEntry[]>({
    queryKey: ['progress', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) return [];
      const entries = await actor.getWeightProgress(exerciseId);
      return entries.sort((a, b) => Number(b.date - a.date));
    },
    enabled: !!actor && !isFetching && exerciseId !== null,
  });
}

export function useSeedExercises() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.seedExercises();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
