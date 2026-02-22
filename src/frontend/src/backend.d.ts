import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    name: string;
    equipmentType: string;
    muscleGroup: string;
}
export type Time = bigint;
export interface Workout {
    id: bigint;
    exerciseIds: Array<bigint>;
    name: string;
    createdAt: Time;
}
export interface WeightEntry {
    weight: bigint;
    exerciseId: bigint;
    date: Time;
    reps: bigint;
    sets: bigint;
    workoutId?: bigint;
}
export interface backendInterface {
    createExercise(name: string, equipmentType: string, muscleGroup: string): Promise<bigint>;
    createWorkout(name: string, exerciseIds: Array<bigint>): Promise<bigint>;
    deleteExercise(id: bigint): Promise<void>;
    deleteWorkout(id: bigint): Promise<void>;
    filterExercisesByEquipmentType(equipmentType: string): Promise<Array<Exercise>>;
    filterExercisesByMuscleGroup(muscleGroup: string): Promise<Array<Exercise>>;
    getAllExercisesSorted(): Promise<Array<Exercise>>;
    getExercise(id: bigint): Promise<Exercise>;
    getWeightProgress(exerciseId: bigint): Promise<Array<WeightEntry>>;
    getWorkout(id: bigint): Promise<Workout>;
    logWeightEntry(exerciseId: bigint, weight: bigint, reps: bigint, sets: bigint, workoutId: bigint | null): Promise<bigint>;
    updateExercise(id: bigint, name: string, equipmentType: string, muscleGroup: string): Promise<void>;
    updateWorkout(id: bigint, name: string, exerciseIds: Array<bigint>): Promise<void>;
}
