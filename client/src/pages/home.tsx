import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CalendarView } from "@/components/calendar-view";
import { WorkoutView } from "@/components/workout-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Workout, User } from "@shared/schema";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth() as { user: User | undefined; isAuthenticated: boolean; isLoading: boolean };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    description: '',
    color: '#6366F1'
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: dateWorkouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts/date", format(selectedDate, 'yyyy-MM-dd')],
    enabled: isAuthenticated,
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (workoutData: any) => {
      await apiRequest("POST", "/api/workouts", workoutData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/date"] });
      toast({
        title: "Thành công!",
        description: "Đã tạo buổi tập mới",
      });
      setIsAddWorkoutOpen(false);
      setWorkoutForm({ name: '', description: '', color: '#6366F1' });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể tạo buổi tập",
        variant: "destructive",
      });
    },
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Check if there are workouts for this date
    const workoutsForDate = dateWorkouts.filter(w => 
      new Date(w.date).toDateString() === date.toDateString()
    );
    
    if (workoutsForDate.length > 0) {
      setSelectedWorkout(workoutsForDate[0].id);
      setActiveTab('workout');
    }
  };

  const handleAddWorkout = () => {
    setIsAddWorkoutOpen(true);
  };

  const handleCreateWorkout = () => {
    if (!workoutForm.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên buổi tập không được để trống",
        variant: "destructive",
      });
      return;
    }

    createWorkoutMutation.mutate({
      ...workoutForm,
      date: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

  const handleBackToCalendar = () => {
    setActiveTab('calendar');
    setSelectedWorkout(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const workoutColors = [
    { value: '#6366F1', label: 'Vai/Lưng (Xanh dương)' },
    { value: '#10B981', label: 'Ngực/Tay (Xanh lá)' },
    { value: '#F59E0B', label: 'Chân/Mông (Vàng)' },
    { value: '#EF4444', label: 'Cardio (Đỏ)' },
    { value: '#8B5CF6', label: 'Khác (Tím)' }
  ];

  return (
    <div className="w-screen bg-white min-h-screen overflow-x-hidden">
      <Header />
      
      {activeTab === 'calendar' && (
        <CalendarView
          onDateSelect={handleDateSelect}
          onAddWorkout={handleAddWorkout}
        />
      )}

      {activeTab === 'workout' && (
        <WorkoutView
          workoutId={selectedWorkout}
          selectedDate={selectedDate}
          onBack={handleBackToCalendar}
        />
      )}

      {activeTab === 'workouts' && (
        <div className="w-full px-4 pb-24">
          <h2 className="text-2xl font-bold text-dark mb-6">Bài tập</h2>
          <p className="text-gray-500 text-center py-8">Tính năng đang phát triển</p>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="w-full px-4 pb-24">
          <h2 className="text-2xl font-bold text-dark mb-6">Tiến độ</h2>
          <p className="text-gray-500 text-center py-8">Tính năng đang phát triển</p>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="w-full px-4 pb-24">
          <h2 className="text-2xl font-bold text-dark mb-6">Hồ sơ</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.profileImageUrl || ''}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-dark">
                  {user?.firstName || user?.lastName 
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : 'Người dùng'
                  }
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/api/logout'}
              variant="outline"
              className="w-full"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Add Workout Modal */}
      <Dialog open={isAddWorkoutOpen} onOpenChange={setIsAddWorkoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo buổi tập mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workoutName">Tên buổi tập</Label>
              <Input
                id="workoutName"
                value={workoutForm.name}
                onChange={(e) => setWorkoutForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Vai/Lưng, Ngực/Tay..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="workoutDescription">Mô tả (tùy chọn)</Label>
              <Textarea
                id="workoutDescription"
                value={workoutForm.description}
                onChange={(e) => setWorkoutForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết buổi tập..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Màu sắc</Label>
              <Select 
                value={workoutForm.color} 
                onValueChange={(value) => setWorkoutForm(prev => ({ ...prev, color: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workoutColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setIsAddWorkoutOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleCreateWorkout}
                disabled={createWorkoutMutation.isPending}
              >
                {createWorkoutMutation.isPending ? "Đang tạo..." : "Tạo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
