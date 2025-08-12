import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [completedSets, setCompletedSets] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(exercise.restDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editName, setEditName] = useState(exercise.name);
  const [editDescription, setEditDescription] = useState(exercise.description || '');
  const [editSets, setEditSets] = useState(exercise.sets);
  const [editReps, setEditReps] = useState(exercise.reps);
  const [editRestDuration, setEditRestDuration] = useState(exercise.restDuration);

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
            // Play notification sound - a clear bell/beep sound
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // Create three beeps for better notification
            for (let i = 0; i < 3; i++) {
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.value = 800; // Frequency in Hz
              oscillator.type = 'sine';
              
              // Fade in and out for smoother sound
              gainNode.gain.setValueAtTime(0, audioContext.currentTime + (i * 0.3));
              gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + (i * 0.3) + 0.01);
              gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + (i * 0.3) + 0.15);
              gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (i * 0.3) + 0.2);
              
              oscillator.start(audioContext.currentTime + (i * 0.3));
              oscillator.stop(audioContext.currentTime + (i * 0.3) + 0.2);
            }
            
            toast({
              title: "⏰ Hết thời gian nghỉ!",
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

  const incrementSets = () => {
    if (completedSets < exercise.sets) {
      setCompletedSets(completedSets + 1);
      if (completedSets + 1 < exercise.sets) {
        handleStartRest();
      } else if (completedSets + 1 === exercise.sets) {
        // All sets completed
        updateExerciseMutation.mutate({ completed: true });
        toast({
          title: "Hoàn thành!",
          description: `Đã hoàn thành bài tập ${exercise.name}`,
        });
      }
    }
  };

  const decrementSets = () => {
    if (completedSets > 0) {
      setCompletedSets(completedSets - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (completedSets / exercise.sets) * 100;

  // Function to detect and format URLs in text with truncation
  const formatDescription = (text: string | null, expanded: boolean = false) => {
    if (!text) return null;
    
    // Truncate text if not expanded
    let displayText = text;
    if (!expanded) {
      const words = text.split(' ');
      if (words.length > 10) {
        displayText = words.slice(0, 10).join(' ') + '...';
      }
    }
    
    // URL detection regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = displayText.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

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
              <p className="text-sm text-gray-600 mt-1">{formatDescription(exercise.description, isExpanded)}</p>
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
                setEditName(exercise.name);
                setEditDescription(exercise.description || '');
                setEditSets(exercise.sets);
                setEditReps(exercise.reps);
                setEditRestDuration(exercise.restDuration);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {(isExpanded || isResting) && !exercise.completed && (
        <CardContent className="space-y-4">
          {/* Set Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Tiến độ: {completedSets}/{exercise.sets} hiệp
              </span>
              <span className="text-sm text-gray-600">
                Mỗi hiệp {exercise.reps} lần
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-3" />
            
            {/* Set Counter */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementSets}
                disabled={completedSets === 0 || isResting}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <div className="text-3xl font-bold">{completedSets}</div>
                <div className="text-xs text-gray-600">hiệp đã hoàn thành</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementSets}
                disabled={completedSets >= exercise.sets || isResting}
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

          {/* Complete Exercise Button */}
          {!isResting && completedSets === exercise.sets && (
            <Button
              className="w-full"
              onClick={() => updateExerciseMutation.mutate({ completed: true })}
            >
              <Check className="w-4 h-4 mr-2" />
              Hoàn thành bài tập
            </Button>
          )}
        </CardContent>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài tập</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exercise-name">Tên bài tập</Label>
              <Input
                id="exercise-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nhập tên bài tập"
              />
            </div>
            <div>
              <Label htmlFor="exercise-description">Mô tả</Label>
              <Input
                id="exercise-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Nhập mô tả bài tập (tùy chọn)"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="exercise-sets">Số hiệp</Label>
                <Input
                  id="exercise-sets"
                  type="number"
                  min="1"
                  value={editSets}
                  onChange={(e) => setEditSets(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="exercise-reps">Số lần</Label>
                <Input
                  id="exercise-reps"
                  type="number"
                  min="1"
                  value={editReps}
                  onChange={(e) => setEditReps(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="exercise-rest">Nghỉ (giây)</Label>
                <Input
                  id="exercise-rest"
                  type="number"
                  min="0"
                  step="5"
                  value={editRestDuration}
                  onChange={(e) => setEditRestDuration(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (editName.trim() && editSets > 0 && editReps > 0 && editRestDuration >= 0) {
                  updateExerciseMutation.mutate({ 
                    name: editName,
                    description: editDescription.trim() || null,
                    sets: editSets,
                    reps: editReps,
                    restDuration: editRestDuration
                  });
                  setIsEditDialogOpen(false);
                }
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa bài tập "{exercise.name}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteExerciseMutation.mutate();
                setIsDeleteDialogOpen(false);
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}