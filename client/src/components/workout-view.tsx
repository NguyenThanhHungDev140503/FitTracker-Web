import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Plus } from "lucide-react";
import { WorkoutCard } from "@/components/workout-card";
import { AddExerciseModal } from "@/components/add-exercise-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Workout, Exercise } from "@shared/schema";

interface WorkoutViewProps {
  workoutId: string | null;
  selectedDate: Date;
  onBack: () => void;
}

export function WorkoutView({ workoutId, selectedDate, onBack }: WorkoutViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  const { data: workout, isLoading: workoutLoading } = useQuery<Workout>({
    queryKey: ["/api/workouts", workoutId],
    enabled: !!workoutId,
  });

  const { data: exercises = [], isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/workouts", workoutId, "exercises"],
    enabled: !!workoutId,
  });

  const updateExerciseMutation = useMutation({
    mutationFn: async ({ exerciseId, updates }: { exerciseId: string; updates: Partial<Exercise> }) => {
      await apiRequest("PATCH", `/api/exercises/${exerciseId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts", workoutId, "exercises"] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bài tập",
        variant: "destructive",
      });
    },
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/workouts/${workoutId}`, { completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts", workoutId] });
      toast({
        title: "Thành công!",
        description: "Bạn đã hoàn thành buổi tập",
      });
      onBack();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể hoàn thành buổi tập",
        variant: "destructive",
      });
    },
  });

  const handleUpdateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    updateExerciseMutation.mutate({ exerciseId, updates });
  };

  const handleCompleteWorkout = () => {
    completeWorkoutMutation.mutate();
  };

  const completedExercises = exercises.filter(ex => ex.currentCount >= ex.maxCount).length;
  const progressPercentage = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  if (workoutLoading || exercisesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Không tìm thấy buổi tập</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      {/* Workout Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2 -ml-2 mr-3">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-dark">{workout.name}</h2>
          <p className="text-sm text-gray-500">
            {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </p>
        </div>
      </div>

      {/* Workout Progress */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Tiến độ buổi tập</span>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-primary">
              {completedExercises}/{exercises.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddExerciseOpen(true)}
              className="h-7 px-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              Thêm
            </Button>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Workout Cards */}
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <WorkoutCard
            key={exercise.id}
            exercise={exercise}
            onUpdateExercise={handleUpdateExercise}
          />
        ))}
      </div>

      {/* Complete Workout Button */}
      {exercises.length > 0 && (
        <div className="mt-6">
          <Button
            onClick={handleCompleteWorkout}
            disabled={completeWorkoutMutation.isPending || (workout.completed ?? false)}
            className="w-full bg-secondary hover:bg-emerald-600 text-white py-4 text-lg font-semibold"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {workout.completed ? "Đã hoàn thành" : "Hoàn thành buổi tập"}
          </Button>
        </div>
      )}

      {exercises.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Chưa có bài tập nào trong buổi tập này</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại lịch
          </Button>
        </div>
      )}

      {/* Add Exercise Modal */}
      {workoutId && (
        <AddExerciseModal
          workoutId={workoutId}
          isOpen={isAddExerciseOpen}
          onClose={() => setIsAddExerciseOpen(false)}
        />
      )}
    </div>
  );
}
