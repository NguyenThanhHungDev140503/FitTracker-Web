import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { vi } from "date-fns/locale";
import { useLocation } from "wouter";
import { WorkoutForm } from "@/components/workout-form";
import type { Workout } from "@shared/schema";

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  onAddWorkout: () => void;
}

export function CalendarView({ onDateSelect, onAddWorkout }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [, setLocation] = useLocation();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout => 
      isSameDay(new Date(workout.date), date)
    );
  };

  const getWorkoutColor = (workouts: Workout[]) => {
    if (workouts.length === 0) return null;
    // Return the color of the first workout
    return workouts[0].color;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-2xl font-bold text-dark">
          {format(currentDate, 'MMMM yyyy', { locale: vi })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid - Full Width */}
      <div className="bg-white shadow-sm border-y border-gray-100 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map(date => {
            const dayWorkouts = getWorkoutsForDate(date);
            const workoutColor = getWorkoutColor(dayWorkouts);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            return (
              <button
                key={date.toString()}
                onClick={() => handleDateClick(date)}
                className={`
                  p-2 h-16 border-r border-b border-gray-100 text-left hover:bg-gray-50 relative
                  ${isSelected ? 'bg-primary text-white' : ''}
                  ${isToday && !isSelected ? 'bg-blue-50 font-medium' : ''}
                  ${dayWorkouts.length > 0 && !isSelected ? 'bg-opacity-20' : ''}
                `}
                style={{
                  backgroundColor: dayWorkouts.length > 0 && !isSelected 
                    ? `${workoutColor}20` 
                    : undefined
                }}
              >
                <span className={`text-sm ${isSelected ? 'font-bold text-white' : ''}`}>
                  {format(date, 'd')}
                </span>
                {dayWorkouts.length > 0 && (
                  <div 
                    className={`w-2 h-2 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'white' : (workoutColor || '#6366F1')
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Workouts */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark">
            {format(selectedDate, "EEEE, dd MMMM", { locale: vi })}
          </h3>
          <Button
            onClick={() => setShowWorkoutForm(true)}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm buổi tập
          </Button>
        </div>
        
        {getWorkoutsForDate(selectedDate).length > 0 ? (
          <div className="space-y-3">
            {getWorkoutsForDate(selectedDate).map((workout) => (
              <button
                key={workout.id}
                onClick={() => setLocation(`/workout/${workout.id}`)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: workout.color }}
                      />
                      <h4 className="font-semibold text-dark">{workout.name}</h4>
                    </div>
                    {workout.description && (
                      <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {workout.completed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Hoàn thành
                      </span>
                    )}
                    <Dumbbell className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-4">Chưa có buổi tập nào</p>
            <Button
              onClick={() => setShowWorkoutForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo buổi tập mới
            </Button>
          </div>
        )}
      </div>

      {/* Workout Form */}
      {showWorkoutForm && (
        <WorkoutForm
          selectedDate={selectedDate}
          onClose={() => setShowWorkoutForm(false)}
          onSuccess={() => setShowWorkoutForm(false)}
        />
      )}
    </div>
  );
}
