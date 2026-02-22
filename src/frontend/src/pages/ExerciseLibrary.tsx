import { useState, useEffect } from 'react';
import { useGetAllExercises, useSeedExercises, useCreateExercise } from '../hooks/useQueries';
import ExerciseCard from '../components/ExerciseCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Exercise } from '../backend';

const EQUIPMENT_TYPES = [
  'Dumbbell',
  'Barbell',
  'Free Weight',
  'Machine',
  'Plate-Loaded Machine',
  'Cable',
  'Treadmill',
  'Assault Bike',
  'Bike',
  'Stairmaster',
];

const MUSCLE_GROUPS = [
  'back',
  'chest',
  'biceps',
  'triceps',
  'shoulders',
  'core',
  'lower body',
  'full body',
];

export default function ExerciseLibrary() {
  const { data: exercises, isLoading } = useGetAllExercises();
  const seedMutation = useSeedExercises();
  const createMutation = useCreateExercise();
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    equipmentType: '',
    muscleGroup: '',
  });

  useEffect(() => {
    if (!exercises) return;

    let filtered = [...exercises];

    if (equipmentFilter !== 'all') {
      filtered = filtered.filter((ex) => ex.equipmentType === equipmentFilter);
    }

    if (muscleFilter !== 'all') {
      filtered = filtered.filter((ex) => ex.muscleGroup === muscleFilter);
    }

    setFilteredExercises(filtered);
  }, [exercises, equipmentFilter, muscleFilter]);

  const handleSeedExercises = async () => {
    try {
      await seedMutation.mutateAsync();
      toast.success('Exercise library seeded successfully!');
    } catch (error) {
      toast.error('Failed to seed exercises');
    }
  };

  const handleCreateExercise = async () => {
    if (!newExercise.name || !newExercise.equipmentType || !newExercise.muscleGroup) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: newExercise.name,
        equipmentType: newExercise.equipmentType,
        muscleGroup: newExercise.muscleGroup,
      });
      toast.success('Exercise created successfully!');
      setIsCreateDialogOpen(false);
      setNewExercise({ name: '', equipmentType: '', muscleGroup: '' });
    } catch (error) {
      toast.error('Failed to create exercise');
    }
  };

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
          <h1 className="font-display text-3xl font-bold tracking-tight">Exercise Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage exercises by equipment and muscle group
          </p>
        </div>
        <div className="flex gap-2">
          {exercises && exercises.length === 0 && (
            <Button onClick={handleSeedExercises} disabled={seedMutation.isPending}>
              {seedMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                'Seed Exercises'
              )}
            </Button>
          )}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Exercise</DialogTitle>
                <DialogDescription>
                  Add a new exercise to your library. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Exercise Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Bench Press"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment Type</Label>
                  <Select
                    value={newExercise.equipmentType}
                    onValueChange={(value) => setNewExercise({ ...newExercise, equipmentType: value })}
                  >
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="muscle">Muscle Group</Label>
                  <Select
                    value={newExercise.muscleGroup}
                    onValueChange={(value) => setNewExercise({ ...newExercise, muscleGroup: value })}
                  >
                    <SelectTrigger id="muscle">
                      <SelectValue placeholder="Select muscle group" />
                    </SelectTrigger>
                    <SelectContent>
                      {MUSCLE_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateExercise} disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Exercise'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Equipment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {EQUIPMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={muscleFilter} onValueChange={setMuscleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Muscle Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Muscles</SelectItem>
              {MUSCLE_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(equipmentFilter !== 'all' || muscleFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEquipmentFilter('all');
                setMuscleFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed border-border p-8">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No exercises found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise, index) => (
              <ExerciseCard key={`${exercise.name}-${index}`} exercise={exercise} exerciseId={BigInt(index)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
