import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Play, Pause, RotateCcw } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";

interface TimerComponentProps {
  duration: number; // in seconds
  onDurationChange: (duration: number) => void;
}

export function TimerComponent({ duration, onDurationChange }: TimerComponentProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempDuration, setTempDuration] = useState(duration);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    };

    audioRef.current = { play: createBeepSound } as HTMLAudioElement;
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            // Play sound when timer completes
            if (audioRef.current) {
              try {
                audioRef.current.play();
              } catch (error) {
                console.log("Could not play audio:", error);
              }
            }
            return duration;
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
  }, [isRunning, isPaused, duration]);

  // Update timeRemaining when duration changes
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(duration);
    }
  }, [duration, isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    } else {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(duration);
  };

  const handleSaveSettings = () => {
    onDurationChange(tempDuration);
    setIsSettingsOpen(false);
    if (!isRunning) {
      setTimeRemaining(tempDuration);
    }
  };

  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Thời gian nghỉ</span>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1 h-auto">
              <Settings className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cài đặt thời gian</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Thời gian nghỉ (giây): {tempDuration}s</Label>
                <Slider
                  value={[tempDuration]}
                  onValueChange={(value) => setTempDuration(value[0])}
                  min={30}
                  max={300}
                  step={30}
                  className="mt-2"
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
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <CircularProgress progress={progress} size={80} strokeWidth={3} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-dark">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={handleStartPause}
            variant={isRunning && !isPaused ? "secondary" : "default"}
          >
            {isRunning && !isPaused ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Tạm dừng
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Bắt đầu
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
