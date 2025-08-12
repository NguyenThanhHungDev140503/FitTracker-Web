import { CountComponent } from "@/components/count-component";
import { TimerComponent } from "@/components/timer-component";
import { Dumbbell, Activity, Heart } from "lucide-react";
import type { Exercise } from "@shared/schema";

interface WorkoutCardProps {
  exercise: Exercise;
  onUpdateExercise: (exerciseId: string, updates: Partial<Exercise>) => void;
}

const exerciseIcons = {
  strength: Dumbbell,
  cardio: Activity,
  core: Heart,
};

const exerciseColors = {
  strength: "bg-blue-100 text-primary",
  cardio: "bg-green-100 text-secondary", 
  core: "bg-yellow-100 text-accent",
};

export function WorkoutCard({ exercise, onUpdateExercise }: WorkoutCardProps) {
  const IconComponent = exerciseIcons.strength; // Default to strength icon
  const iconColorClass = exerciseColors.strength; // Default color

  const handleCountChange = (count: number) => {
    onUpdateExercise(exercise.id, { currentCount: count });
  };

  const handleMaxCountChange = (maxCount: number) => {
    onUpdateExercise(exercise.id, { maxCount });
  };

  const handleDurationChange = (duration: number) => {
    onUpdateExercise(exercise.id, { restDuration: duration });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-dark">{exercise.name}</h3>
          <p className="text-sm text-gray-500">
            {exercise.sets} sets x {exercise.reps} reps
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColorClass}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      
      <CountComponent
        currentCount={exercise.currentCount}
        maxCount={exercise.maxCount}
        onCountChange={handleCountChange}
        onMaxCountChange={handleMaxCountChange}
      />

      <TimerComponent
        duration={exercise.restDuration}
        onDurationChange={handleDurationChange}
      />
    </div>
  );
}
