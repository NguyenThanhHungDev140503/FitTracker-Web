import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Timer, Activity, Calendar, ArrowLeft, Home } from "lucide-react";
import { Exercise, Workout } from "@shared/schema";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Extended Exercise type with workout info
interface ExerciseWithWorkout extends Exercise {
  workout?: Workout;
}

export default function Exercises() {
  const [, setLocation] = useLocation();
  const [exercisesWithWorkouts, setExercisesWithWorkouts] = useState<ExerciseWithWorkout[]>([]);
  const [exercisesByCategory, setExercisesByCategory] = useState<Record<string, Exercise[]>>({});

  // Fetch all exercises
  const { data: exercises = [], isLoading: isLoadingExercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  // Fetch all workouts to get workout names for exercises
  const { data: workouts = [], isLoading: isLoadingWorkouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  // Combine exercises with workout information
  useEffect(() => {
    if (exercises.length > 0 && workouts.length > 0) {
      const combined = exercises.map(exercise => {
        const workout = workouts.find(w => w.id === exercise.workoutId);
        return { ...exercise, workout };
      });
      setExercisesWithWorkouts(combined);

      // Group exercises by category/type
      const grouped = exercises.reduce((acc, exercise) => {
        const category = exercise.type || "Khác";
        if (!acc[category]) {
          acc[category] = [];
        }
        // Check if exercise with same name already exists
        const existingExercise = acc[category].find(e => e.name === exercise.name);
        if (!existingExercise) {
          acc[category].push(exercise);
        }
        return acc;
      }, {} as Record<string, Exercise[]>);
      
      setExercisesByCategory(grouped);
    }
  }, [exercises, workouts]);

  const isLoading = isLoadingExercises || isLoadingWorkouts;

  const getCategoryName = (type: string) => {
    switch (type) {
      case "strength":
        return "Sức mạnh";
      case "cardio":
        return "Tim mạch";
      case "core":
        return "Core";
      default:
        return "Khác";
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Target className="w-4 h-4" />;
      case "cardio":
        return <Activity className="w-4 h-4" />;
      case "core":
        return <Timer className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 space-y-4">
          <h1 className="text-2xl font-bold">Bài tập</h1>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-20 bg-gray-200" />
                <CardContent className="h-32 bg-gray-100" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 space-y-4">
          <h1 className="text-2xl font-bold">Bài tập</h1>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Activity className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Chưa có bài tập nào</p>
              <p className="text-sm text-gray-500">
                Thêm bài tập vào buổi tập của bạn để xem chúng ở đây
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Bài tập</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Tổng cộng: {exercises.length} bài tập
          </p>
        </div>

        {/* Recent exercises */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Bài tập gần đây
          </h2>
          <div className="grid gap-3">
            {exercisesWithWorkouts.slice(0, 5).map((exercise) => (
              <Card key={exercise.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{exercise.name}</h3>
                        {exercise.completed && (
                          <Badge className="text-xs bg-green-500 text-white">
                            Hoàn thành
                          </Badge>
                        )}
                      </div>
                      {exercise.workout && (
                        <p className="text-xs text-gray-500 mb-2">
                          {exercise.workout.name} • {format(new Date(exercise.workout.date), "d 'tháng' M", { locale: vi })}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          {exercise.sets}x{exercise.reps}
                        </span>
                        <span className="flex items-center">
                          <Timer className="w-3 h-3 mr-1" />
                          {exercise.restDuration}s
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {getCategoryName(exercise.type || "other")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Exercises by category */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Danh mục bài tập</h2>
          <div className="space-y-4">
            {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <h3 className="font-medium">{getCategoryName(category)}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {categoryExercises.length}
                  </Badge>
                </div>
                <div className="grid gap-2 pl-6">
                  {categoryExercises.map((exercise) => (
                    <Card key={exercise.id} className="shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{exercise.name}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>{exercise.sets}x{exercise.reps}</span>
                            <span>{exercise.restDuration}s nghỉ</span>
                          </div>
                        </div>
                        {exercise.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {exercise.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}