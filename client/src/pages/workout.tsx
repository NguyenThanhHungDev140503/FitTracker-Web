import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Check,
  Timer,
  Target,
  Dumbbell,
  Edit,
  Trash
} from "lucide-react";
import type { Workout, Exercise } from "@shared/schema";
import { ExerciseForm } from "@/components/exercise-form";
import { ExerciseCard } from "@/components/exercise-card";

export default function WorkoutPage() {
  const [, params] = useRoute("/workout/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [activeTab, setActiveTab] = useState("exercises");

  // Fetch workout data
  const { data: workout, isLoading: workoutLoading } = useQuery<Workout>({
    queryKey: [`/api/workouts/${params?.id}`],
    enabled: !!params?.id,
  });

  // Fetch exercises for this workout
  const { data: exercises = [], isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: [`/api/workouts/${params?.id}/exercises`],
    enabled: !!params?.id,
  });

  // Update workout mutation
  const updateWorkoutMutation = useMutation({
    mutationFn: async (updates: Partial<Workout>) => {
      const res = await apiRequest("PATCH", `/api/workouts/${params?.id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${params?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Cập nhật thành công",
        description: "Buổi tập đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật buổi tập",
        variant: "destructive",
      });
    },
  });

  // Delete workout mutation
  const deleteWorkoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/workouts/${params?.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Buổi tập đã được xóa",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa buổi tập",
        variant: "destructive",
      });
    },
  });

  // Calculate progress
  const completedExercises = exercises.filter((e) => e.completed).length;
  const totalExercises = exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Auto-update workout completion status
  useEffect(() => {
    if (workout && totalExercises > 0) {
      const shouldBeCompleted = completedExercises === totalExercises;
      if (workout.completed !== shouldBeCompleted) {
        updateWorkoutMutation.mutate({ completed: shouldBeCompleted });
      }
    }
  }, [completedExercises, totalExercises, workout]);

  if (workoutLoading || exercisesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy buổi tập</p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`${workout.completed ? 'bg-green-500' : 'bg-primary'} text-white sticky top-0 z-40`}>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{workout.name}</h1>
                {workout.completed && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Check className="w-3 h-3 mr-1" />
                    Hoàn thành
                  </Badge>
                )}
              </div>
              {workout.description && (
                <p className="text-sm text-white/80">{workout.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newName = prompt("Tên buổi tập:", workout.name);
                if (newName) {
                  updateWorkoutMutation.mutate({ name: newName });
                }
              }}
              className="text-white hover:bg-white/10 p-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Bạn có chắc muốn xóa buổi tập này?")) {
                  deleteWorkoutMutation.mutate();
                }
              }}
              className="text-white hover:bg-white/10 p-2"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>{workout.completed ? '✓ Hoàn thành' : 'Tiến độ'}</span>
            <span>{completedExercises}/{totalExercises} bài tập</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${workout.completed ? 'bg-green-300/30' : 'bg-white/20'}`} 
          />
        </div>
      </div>

      {/* Completion Message */}
      {workout.completed && (
        <div className="px-4 py-4">
          <Card className="border-green-200 bg-green-50 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Xuất sắc!</h3>
              <p className="text-sm text-green-600">Bạn đã hoàn thành buổi tập này</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 px-4 py-4">
        <Card className={`border-0 shadow-sm ${workout.completed ? 'bg-green-50' : ''}`}>
          <CardContent className="p-4 text-center">
            <Target className={`w-6 h-6 mx-auto mb-2 ${workout.completed ? 'text-green-600' : 'text-primary'}`} />
            <p className="text-2xl font-bold">{totalExercises}</p>
            <p className="text-xs text-gray-600">Tổng bài tập</p>
          </CardContent>
        </Card>
        <Card className={`border-0 shadow-sm ${workout.completed ? 'bg-green-50' : ''}`}>
          <CardContent className="p-4 text-center">
            <Check className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">{completedExercises}</p>
            <p className="text-xs text-gray-600">Hoàn thành</p>
          </CardContent>
        </Card>
        <Card className={`border-0 shadow-sm ${workout.completed ? 'bg-green-50' : ''}`}>
          <CardContent className="p-4 text-center">
            <Timer className={`w-6 h-6 mx-auto mb-2 ${workout.completed ? 'text-green-600' : 'text-blue-500'}`} />
            <p className="text-2xl font-bold">
              {exercises.reduce((acc, e) => acc + e.sets * e.restDuration, 0) / 60}
            </p>
            <p className="text-xs text-gray-600">Phút nghỉ</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="exercises">Bài tập</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-4">
          {exercises.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Chưa có bài tập nào</p>
                <Button
                  onClick={() => setShowAddExercise(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài tập
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  workoutCompleted={workout.completed || false}
                  onUpdate={() => {
                    queryClient.invalidateQueries({ 
                      queryKey: [`/api/workouts/${params?.id}/exercises`] 
                    });
                  }}
                />
              ))}
              <Button
                onClick={() => setShowAddExercise(true)}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bài tập
              </Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <textarea
                className="w-full min-h-[200px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ghi chú về buổi tập..."
                value={workout.description || ""}
                onChange={(e) => {
                  updateWorkoutMutation.mutate({ description: e.target.value });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Exercise Form */}
      {showAddExercise && (
        <ExerciseForm
          workoutId={params?.id || ""}
          onClose={() => setShowAddExercise(false)}
          onSuccess={() => {
            setShowAddExercise(false);
            queryClient.invalidateQueries({ 
              queryKey: [`/api/workouts/${params?.id}/exercises`] 
            });
          }}
        />
      )}
    </div>
  );
}