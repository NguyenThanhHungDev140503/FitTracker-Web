import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddExerciseModalProps {
  workoutId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddExerciseModal({ workoutId, isOpen, onClose }: AddExerciseModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    description: '',
    sets: 3,
    reps: 10,
    maxCount: 10,
    restDuration: 60,
    order: 0
  });

  const createExerciseMutation = useMutation({
    mutationFn: async (exerciseData: any) => {
      await apiRequest("POST", `/api/workouts/${workoutId}/exercises`, exerciseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts", workoutId, "exercises"] });
      toast({
        title: "Thành công!",
        description: "Đã thêm bài tập mới",
      });
      onClose();
      setExerciseForm({
        name: '',
        description: '',
        sets: 3,
        reps: 10,
        maxCount: 10,
        restDuration: 60,
        order: 0
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể thêm bài tập",
        variant: "destructive",
      });
    },
  });

  const handleCreateExercise = () => {
    if (!exerciseForm.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên bài tập không được để trống",
        variant: "destructive",
      });
      return;
    }

    createExerciseMutation.mutate(exerciseForm);
  };

  const commonExercises = [
    { name: "Đẩy tạ đòn", sets: 3, reps: 10, maxCount: 30, restDuration: 90 },
    { name: "Gập bụng", sets: 3, reps: 15, maxCount: 45, restDuration: 60 },
    { name: "Squat", sets: 3, reps: 12, maxCount: 36, restDuration: 90 },
    { name: "Pull-up", sets: 3, reps: 8, maxCount: 24, restDuration: 90 },
    { name: "Plank", sets: 3, reps: 1, maxCount: 3, restDuration: 60 },
  ];

  const selectCommonExercise = (exercise: typeof commonExercises[0]) => {
    setExerciseForm(prev => ({
      ...prev,
      ...exercise
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm bài tập</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Common Exercises */}
          <div>
            <Label className="text-sm font-medium text-gray-600 mb-2 block">Bài tập phổ biến</Label>
            <div className="grid grid-cols-1 gap-2">
              {commonExercises.map((exercise, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-3"
                  onClick={() => selectCommonExercise(exercise)}
                >
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-500">
                      {exercise.sets} sets x {exercise.reps} reps, nghỉ {exercise.restDuration}s
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-gray-600 mb-2 block">Hoặc tạo bài tập tùy chỉnh</Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="exerciseName">Tên bài tập</Label>
                <Input
                  id="exerciseName"
                  value={exerciseForm.name}
                  onChange={(e) => setExerciseForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: Đẩy tạ đòn, Gập bụng..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="exerciseDescription">Mô tả (tùy chọn)</Label>
                <Textarea
                  id="exerciseDescription"
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết bài tập..."
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sets">Số sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    value={exerciseForm.sets}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, sets: Number(e.target.value) }))}
                    min={1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reps">Số reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    value={exerciseForm.reps}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, reps: Number(e.target.value) }))}
                    min={1}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="maxCount">Tổng số lần</Label>
                  <Input
                    id="maxCount"
                    type="number"
                    value={exerciseForm.maxCount}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, maxCount: Number(e.target.value) }))}
                    min={1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restDuration">Thời gian nghỉ (giây)</Label>
                  <Input
                    id="restDuration"
                    type="number"
                    value={exerciseForm.restDuration}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, restDuration: Number(e.target.value) }))}
                    min={30}
                    step={30}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleCreateExercise}
              disabled={createExerciseMutation.isPending}
            >
              {createExerciseMutation.isPending ? "Đang thêm..." : "Thêm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}