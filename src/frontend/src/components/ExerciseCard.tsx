import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Exercise } from '../backend';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

const equipmentColors: Record<string, string> = {
  Dumbbell: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  Barbell: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'Free Weight': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  Machine: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  'Plate-Loaded Machine': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  Cable: 'bg-primary/20 text-primary border-primary/30',
};

const muscleColors: Record<string, string> = {
  back: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  chest: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  biceps: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  triceps: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  shoulders: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  core: 'bg-primary/20 text-primary border-primary/30',
  'lower body': 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-lg ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="mb-3 font-display text-lg font-semibold">{exercise.name}</h3>
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
  );
}
