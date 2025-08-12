import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";

export function Header() {
  const { user } = useAuth() as { user: User | undefined };

  return (
    <header className="w-screen bg-primary text-white px-4 py-4 sticky top-0 z-50">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-bold">FitTracker</h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-white/10">
            <Bell className="w-5 h-5" />
          </Button>
          <img
            src={user?.profileImageUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
          />
        </div>
      </div>
    </header>
  );
}
