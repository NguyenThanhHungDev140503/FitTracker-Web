import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Calendar, Timer, TrendingUp } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Calendar,
      title: "Lập lịch tập luyện",
      description: "Dễ dàng quản lý và theo dõi lịch tập hàng ngày"
    },
    {
      icon: Dumbbell,
      title: "Theo dõi bài tập",
      description: "Ghi nhận từng hiệu quả và tiến độ từng bài tập"
    },
    {
      icon: Timer,
      title: "Bộ đếm thời gian",
      description: "Đếm ngược thời gian nghỉ với cảnh báo âm thanh"
    },
    {
      icon: TrendingUp,
      title: "Theo dõi tiến độ",
      description: "Xem báo cáo chi tiết về quá trình tập luyện"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">FitTracker</h1>
          <p className="text-lg opacity-90">Ứng dụng tập gym thông minh</p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-white">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm opacity-80">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Login Button */}
        <div className="text-center">
          <Button
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="w-full bg-white text-primary hover:bg-gray-100 font-semibold text-lg py-6"
          >
            Đăng nhập để bắt đầu
          </Button>
          <p className="text-white/70 text-sm mt-4">
            Đăng nhập bằng tài khoản Replit của bạn
          </p>
        </div>
      </div>
    </div>
  );
}
