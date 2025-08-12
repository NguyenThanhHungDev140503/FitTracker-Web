import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
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
import { format } from "date-fns";
import type { InsertWorkout } from "@shared/schema";

interface WorkoutFormProps {
  selectedDate: Date;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WorkoutForm({ selectedDate, onClose, onSuccess }: WorkoutFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366F1",
  });

  const workoutTemplates = [
    { name: "Tập thân trên", description: "Ngực, vai, tay", color: "#10B981" },
    { name: "Tập chân", description: "Đùi, mông, bắp chân", color: "#6366F1" },
    { name: "Tập lưng & Bắp tay", description: "Lưng, cơ lưng xô, bắp tay sau", color: "#10B981" },
    { name: "Cardio", description: "Chạy, đạp xe, bơi", color: "#EF4444" },
    { name: "Tập core", description: "Bụng, hông, lưng dưới", color: "#F59E0B" },
    { name: "Full body", description: "Toàn thân", color: "#8B5CF6" },
    { name: "HIIT", description: "Tập cường độ cao", color: "#EF4444" },
    { name: "Yoga", description: "Dẻo dai, thư giãn", color: "#8B5CF6" },
  ];

  const createWorkoutMutation = useMutation({
    mutationFn: async (workout: Partial<InsertWorkout>) => {
      const res = await apiRequest("POST", "/api/workouts", workout);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Thành công",
        description: "Đã tạo buổi tập mới",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/workouts/date/${format(selectedDate, 'yyyy-MM-dd')}`] 
      });
      
      // Navigate to the workout detail page
      setLocation(`/workout/${data.id}`);
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo buổi tập",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên buổi tập",
        variant: "destructive",
      });
      return;
    }

    createWorkoutMutation.mutate({
      name: formData.name,
      description: formData.description,
      date: format(selectedDate, 'yyyy-MM-dd'),
      color: formData.color,
    });
  };

  const applyTemplate = (template: typeof workoutTemplates[0]) => {
    setFormData({
      name: template.name,
      description: template.description,
      color: template.color,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo buổi tập mới</DialogTitle>
          <DialogDescription>
            Ngày {format(selectedDate, 'dd/MM/yyyy')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Selection */}
          <div>
            <Label>Mẫu buổi tập</Label>
            <Select onValueChange={(value) => {
              const template = workoutTemplates.find(t => t.name === value);
              if (template) applyTemplate(template);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mẫu buổi tập" />
              </SelectTrigger>
              <SelectContent>
                {workoutTemplates.map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: template.color }}
                      />
                      <span>{template.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workout Name */}
          <div>
            <Label htmlFor="name">Tên buổi tập *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Tập thân trên, Cardio..."
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
              placeholder="Mục tiêu hoặc ghi chú về buổi tập..."
              rows={3}
            />
          </div>

          {/* Color Selection */}
          <div>
            <Label>Màu sắc</Label>
            <div className="grid grid-cols-6 gap-2">
              {[
                "#6366F1", // Indigo
                "#10B981", // Green
                "#EF4444", // Red
                "#F59E0B", // Amber
                "#8B5CF6", // Purple
                "#EC4899", // Pink
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-full h-8 rounded-md border-2 ${
                    formData.color === color ? 'border-gray-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createWorkoutMutation.isPending}
            >
              {createWorkoutMutation.isPending ? "Đang tạo..." : "Tạo buổi tập"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createWorkoutMutation.isPending}
            >
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}