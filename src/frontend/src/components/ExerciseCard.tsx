import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { useUpdateExercise, useDeleteExercise } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Exercise } from '../backend';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseId: bigint;
  onClick?: () => void;
}

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

const equipmentColors: Record<string, string> = {
  Dumbbell: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  Barbell: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'Free Weight': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  Machine: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  'Plate-Loaded Machine': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  Cable: 'bg-primary/20 text-primary border-primary/30',
  Treadmill: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  'Assault Bike': 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  Bike: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  Stairmaster: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
};

const muscleColors: Record<string, string> = {
  back: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  chest: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  biceps: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  triceps: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  shoulders: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  core: 'bg-primary/20 text-primary border-primary/30',
  'lower body': 'bg-destructive/20 text-destructive border-destructive/30',
  'full body': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
};

export default function ExerciseCard({ exercise, exerciseId, onClick }: ExerciseCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedExercise, setEditedExercise] = useState({
    name: exercise.name,
    equipmentType: exercise.equipmentType,
    muscleGroup: exercise.muscleGroup,
  });

  const updateMutation = useUpdateExercise();
  const deleteMutation = useDeleteExercise();

  const handleEdit = async () => {
    if (!editedExercise.name || !editedExercise.equipmentType || !editedExercise.muscleGroup) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: exerciseId,
        name: editedExercise.name,
        equipmentType: editedExercise.equipmentType,
        muscleGroup: editedExercise.muscleGroup,
      });
      toast.success('Exercise updated successfully!');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update exercise');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(exerciseId);
      toast.success('Exercise deleted successfully!');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete exercise');
    }
  };

  return (
    <>
      <Card
        className={`transition-all hover:shadow-lg ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`}
      >
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="flex-1 font-display text-lg font-semibold" onClick={onClick}>
              {exercise.name}
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={equipmentColors[exercise.equipmentType] || 'bg-muted'}>
              {exercise.equipmentType}
            </Badge>
            <Badge variant="outline" className={muscleColors[exercise.muscleGroup] || 'bg-muted'}>
              {exercise.muscleGroup}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Update the exercise details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Exercise Name</Label>
              <Input
                id="edit-name"
                value={editedExercise.name}
                onChange={(e) => setEditedExercise({ ...editedExercise, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-equipment">Equipment Type</Label>
              <Select
                value={editedExercise.equipmentType}
                onValueChange={(value) => setEditedExercise({ ...editedExercise, equipmentType: value })}
              >
                <SelectTrigger id="edit-equipment">
                  <SelectValue />
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
              <Label htmlFor="edit-muscle">Muscle Group</Label>
              <Select
                value={editedExercise.muscleGroup}
                onValueChange={(value) => setEditedExercise({ ...editedExercise, muscleGroup: value })}
              >
                <SelectTrigger id="edit-muscle">
                  <SelectValue />
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{exercise.name}" from your exercise library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
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
    </>
  );
}
