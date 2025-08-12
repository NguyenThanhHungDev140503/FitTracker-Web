import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Trash,
  Plus,
  Minus,
  Timer,
  Target,
  Edit
} from "lucide-react";
import type { Exercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: () => void;
}

export function ExerciseCard({ exercise, onUpdate }: ExerciseCardProps) {
  const { toast } = useToast();
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(exercise.restDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update exercise mutation
  const updateExerciseMutation = useMutation({
    mutationFn: async (updates: Partial<Exercise>) => {
      const res = await apiRequest("PATCH", `/api/exercises/${exercise.id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      onUpdate();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bài tập",
        variant: "destructive",
      });
    },
  });

  // Delete exercise mutation
  const deleteExerciseMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/exercises/${exercise.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Bài tập đã được xóa",
      });
      onUpdate();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài tập",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && restTimeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsResting(false);
            // Play notification sound
            const audio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAADu/u7+');
            audio.play().catch(() => {});
            toast({
              title: "Hết thời gian nghỉ!",
              description: "Bắt đầu hiệp tiếp theo",
            });
            return exercise.restDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, restTimeLeft, exercise.restDuration]);

  const handleStartRest = () => {
    setIsResting(true);
    setIsTimerRunning(true);
    setRestTimeLeft(exercise.restDuration);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResumeTimer = () => {
    setIsTimerRunning(true);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRestTimeLeft(exercise.restDuration);
  };

  const handleCompleteSet = () => {
    if (currentSet < exercise.sets) {
      setCurrentSet(currentSet + 1);
      setCurrentReps(0);
      handleStartRest();
    } else {
      // All sets completed
      updateExerciseMutation.mutate({ completed: true });
      toast({
        title: "Hoàn thành!",
        description: `Đã hoàn thành bài tập ${exercise.name}`,
      });
    }
  };

  const incrementReps = () => {
    if (currentReps < exercise.reps) {
      setCurrentReps(currentReps + 1);
      if (currentReps + 1 === exercise.reps) {
        handleCompleteSet();
      }
    }
  };

  const decrementReps = () => {
    if (currentReps > 0) {
      setCurrentReps(currentReps - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentReps / exercise.reps) * 100;

  return (
    <Card className={`border-0 shadow-sm ${exercise.completed ? 'opacity-60' : ''}`}>
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{exercise.name}</h3>
              {exercise.completed && (
                <Badge className="text-xs bg-green-500 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Hoàn thành
                </Badge>
              )}
            </div>
            {exercise.description && (
              <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {exercise.sets} hiệp x {exercise.reps} lần
              </span>
              <span className="flex items-center">
                <Timer className="w-4 h-4 mr-1" />
                {exercise.restDuration}s nghỉ
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                const newName = prompt("Tên bài tập:", exercise.name);
                if (newName) {
                  updateExerciseMutation.mutate({ name: newName });
                }
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Xóa bài tập này?")) {
                  deleteExerciseMutation.mutate();
                }
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {(isExpanded || isResting) && !exercise.completed && (
        <CardContent className="space-y-4">
          {/* Current Set Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Hiệp {currentSet}/{exercise.sets}
              </span>
              <span className="text-sm text-gray-600">
                {currentReps}/{exercise.reps} lần
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-3" />
            
            {/* Rep Counter */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementReps}
                disabled={currentReps === 0 || isResting}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <div className="text-3xl font-bold">{currentReps}</div>
                <div className="text-xs text-gray-600">lần</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementReps}
                disabled={currentReps >= exercise.reps || isResting}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Rest Timer */}
          {isResting && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-blue-600">
                  {formatTime(restTimeLeft)}
                </div>
                <div className="text-sm text-gray-600">Thời gian nghỉ</div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                {isTimerRunning ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePauseTimer}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Tạm dừng
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResumeTimer}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Tiếp tục
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetTimer}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Đặt lại
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsResting(false);
                    setIsTimerRunning(false);
                    setRestTimeLeft(exercise.restDuration);
                  }}
                >
                  Bỏ qua
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {!isResting && currentSet === exercise.sets && currentReps === exercise.reps && (
              <Button
                className="flex-1"
                onClick={() => updateExerciseMutation.mutate({ completed: true })}
              >
                <Check className="w-4 h-4 mr-2" />
                Hoàn thành bài tập
              </Button>
            )}
            {!isResting && currentReps < exercise.reps && (
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleCompleteSet}
              >
                Hoàn thành hiệp {currentSet}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}