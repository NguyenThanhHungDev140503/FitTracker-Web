import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { vi } from "date-fns/locale";
import type { Workout } from "@shared/schema";

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  onAddWorkout: () => void;
}

export function CalendarView({ onDateSelect, onAddWorkout }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-6">
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

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

      {/* Quick Add Button */}
      <Button
        onClick={onAddWorkout}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        size="sm"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Workout Legend */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-dark mb-3">Loại bài tập</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-gray-600">Vai/Lưng</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-sm text-gray-600">Ngực/Tay</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-gray-600">Chân/Mông</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
