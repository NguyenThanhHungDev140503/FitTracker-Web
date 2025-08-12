import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, Minus } from "lucide-react";

interface CountComponentProps {
  currentCount: number;
  maxCount: number;
  onCountChange: (count: number) => void;
  onMaxCountChange: (maxCount: number) => void;
}

export function CountComponent({ 
  currentCount, 
  maxCount, 
  onCountChange, 
  onMaxCountChange 
}: CountComponentProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempMaxCount, setTempMaxCount] = useState(maxCount);

  const handleIncrement = () => {
    const newCount = currentCount >= maxCount ? 0 : currentCount + 1;
    onCountChange(newCount);
  };

  const handleDecrement = () => {
    const newCount = currentCount > 0 ? currentCount - 1 : 0;
    onCountChange(newCount);
  };

  const handleSaveSettings = () => {
    onMaxCountChange(tempMaxCount);
    setIsSettingsOpen(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Số lần</span>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1 h-auto">
              <Settings className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cài đặt số lần</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxCount">Số lần tối đa</Label>
                <Input
                  id="maxCount"
                  type="number"
                  value={tempMaxCount}
                  onChange={(e) => setTempMaxCount(Number(e.target.value))}
                  min={1}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Hủy
                </Button>
                <Button className="flex-1" onClick={handleSaveSettings}>
                  Lưu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-lg p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 rounded-full shadow-sm"
          onClick={handleDecrement}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <span className="text-2xl font-bold text-dark">{currentCount}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-lg text-gray-500">{maxCount}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 rounded-full shadow-sm"
          onClick={handleIncrement}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
