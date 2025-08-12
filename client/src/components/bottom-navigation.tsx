import { Calendar, Dumbbell, TrendingUp, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'calendar', label: 'Lịch', icon: Calendar },
    { id: 'workouts', label: 'Bài tập', icon: Dumbbell },
    { id: 'progress', label: 'Tiến độ', icon: TrendingUp },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-screen bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center p-3 ${
              activeTab === id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
