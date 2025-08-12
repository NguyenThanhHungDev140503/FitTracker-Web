import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { InsertExercise } from "@shared/schema";

interface ExerciseFormProps {
  workoutId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExerciseForm({ workoutId, onClose, onSuccess }: ExerciseFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sets: 3,
    reps: 10,
    restDuration: 60,
  });

  // Common exercise templates
  const exerciseTemplates = [
    { name: "Gập bụng", sets: 3, reps: 15, rest: 30 },
    { name: "Hít đất", sets: 3, reps: 10, rest: 60 },
    { name: "Squat", sets: 4, reps: 12, rest: 90 },
    { name: "Deadlift", sets: 3, reps: 8, rest: 120 },
    { name: "Bench Press", sets: 3, reps: 10, rest: 90 },
    { name: "Pull-up", sets: 3, reps: 8, rest: 90 },
    { name: "Plank", sets: 3, reps: 1, rest: 60 },
    { name: "Lunges", sets: 3, reps: 12, rest: 60 },
    { name: "Shoulder Press", sets: 3, reps: 10, rest: 60 },
    { name: "Bicep Curls", sets: 3, reps: 12, rest: 45 },
  ];

  const createExerciseMutation = useMutation({
    mutationFn: async (exercise: Partial<InsertExercise>) => {
      const res = await apiRequest("POST", `/api/workouts/${workoutId}/exercises`, exercise);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm bài tập mới",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể thêm bài tập",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên bài tập",
        variant: "destructive",
      });
      return;
    }

    createExerciseMutation.mutate({
      name: formData.name,
      description: formData.description,
      sets: formData.sets,
      reps: formData.reps,
      restDuration: formData.restDuration,
      order: 0,
    });
  };

  const applyTemplate = (template: typeof exerciseTemplates[0]) => {
    setFormData({
      ...formData,
      name: template.name,
      sets: template.sets,
      reps: template.reps,
      restDuration: template.rest,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm bài tập mới</DialogTitle>
          <DialogDescription>
            Tạo bài tập mới cho buổi tập của bạn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Selection */}
          <div>
            <Label>Mẫu bài tập</Label>
            <Select onValueChange={(value) => {
              const template = exerciseTemplates.find(t => t.name === value);
              if (template) applyTemplate(template);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mẫu bài tập" />
              </SelectTrigger>
              <SelectContent>
                {exerciseTemplates.map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    {template.name} ({template.sets}x{template.reps})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Name */}
          <div>
            <Label htmlFor="name">Tên bài tập *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Gập bụng, Hít đất..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Hướng dẫn thực hiện hoặc ghi chú..."
              rows={3}
            />
          </div>

          {/* Sets and Reps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sets">Số hiệp</Label>
              <Input
                id="sets"
                type="number"
                min={1}
                max={20}
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="reps">Số lần/hiệp</Label>
              <Input
                id="reps"
                type="number"
                min={1}
                max={100}
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          {/* Rest Duration */}
          <div>
            <Label htmlFor="rest">Thời gian nghỉ (giây)</Label>
            <Select 
              value={formData.restDuration.toString()}
              onValueChange={(value) => setFormData({ ...formData, restDuration: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 giây</SelectItem>
                <SelectItem value="45">45 giây</SelectItem>
                <SelectItem value="60">1 phút</SelectItem>
                <SelectItem value="90">1 phút 30 giây</SelectItem>
                <SelectItem value="120">2 phút</SelectItem>
                <SelectItem value="180">3 phút</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createExerciseMutation.isPending}
            >
              {createExerciseMutation.isPending ? "Đang thêm..." : "Thêm bài tập"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createExerciseMutation.isPending}
            >
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}