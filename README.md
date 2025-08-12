# FitTracker - Ứng dụng Theo dõi Tập Gym

FitTracker là một ứng dụng theo dõi tập gym toàn diện được thiết kế cho những người yêu thích thể dục để quản lý lịch tập, theo dõi bài tập và giám sát tiến độ theo thời gian. Ứng dụng cung cấp giao diện trực quan tối ưu cho thiết bị di động với lịch tập theo lịch, theo dõi bài tập theo thời gian thực với bộ đếm và đồng hồ bấm giờ.

## Tính năng chính

- 📅 **Lập lịch tập luyện**: Dễ dàng quản lý và theo dõi lịch tập hàng ngày
- 💪 **Theo dõi bài tập**: Ghi nhận từng hiệu quả và tiến độ từng bài tập
- ⏱️ **Bộ đếm thời gian**: Đếm ngược thời gian nghỉ với cảnh báo âm thanh
- 📈 **Theo dõi tiến độ**: Xem báo cáo chi tiết về quá trình tập luyện
- 🌙 **Chế độ tối**: Giao diện tối để sử dụng thoải mái vào ban đêm

## Công nghệ sử dụng

### Frontend
- **React** với TypeScript
- **Vite** để phát triển nhanh và xây dựng tối ưu
- **Tailwind CSS** để tạo kiểu
- **shadcn/ui** và **Radix UI** cho các thành phần giao diện
- **TanStack Query** để quản lý trạng thái server
- **Wouter** cho định tuyến phía client

### Backend
- **Express.js** với TypeScript
- **Drizzle ORM** để tương tác với cơ sở dữ liệu
- **PostgreSQL** thông qua Neon Database
- **Passport.js** với OpenID Connect cho xác thực Replit

## Cấu trúc dự án

```
FitTracker/
├── client/                 # Ứng dụng frontend React
│   ├── src/
│   │   ├── components/     # Các thành phần UI tái sử dụng
│   │   ├── pages/          # Các trang chính của ứng dụng
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Các tiện ích và thư viện
│   │   ├── App.tsx         # Component gốc
│   │   └── main.tsx        # Entry point
├── server/                 # Ứng dụng backend Express
│   ├── index.ts            # Entry point server
│   ├── routes.ts           # Định tuyến API
│   ├── db.ts               # Kết nối cơ sở dữ liệu
│   └── storage.ts          # Logic truy cập dữ liệu
├── shared/                 # Mã chia sẻ giữa frontend và backend
│   └── schema.ts           # Schema cơ sở dữ liệu và validation
├── dist/                   # Thư mục build sản phẩm
└── node_modules/
```

## Cài đặt

### Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Tài khoản Replit (để xác thực)

### Bước cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd FitTracker
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường**
   Tạo file `.env` trong thư mục gốc với các biến sau:
   ```env
   DATABASE_URL=your_neon_database_url
   REPL_ID=your_replit_id
   ```

4. **Chạy cơ sở dữ liệu**
   ```bash
   npm run db:push
   ```

5. **Chạy ứng dụng ở chế độ phát triển**
   ```bash
   npm run dev
   ```

## Sử dụng

### Chạy ở chế độ phát triển

```bash
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:5000` hoặc cổng được chỉ định trong biến môi trường `PORT`.

### Build sản phẩm

```bash
npm run build
```

### Chạy bản build sản phẩm

```bash
npm run start
```

### Kiểm tra lỗi type

```bash
npm run check
```

## API Endpoints

### Auth
- `GET /api/auth/user` - Lấy thông tin người dùng hiện tại

### Workouts
- `GET /api/workouts` - Lấy tất cả buổi tập của người dùng
- `GET /api/workouts/date/:date` - Lấy buổi tập theo ngày
- `GET /api/workouts/:id` - Lấy thông tin buổi tập cụ thể
- `POST /api/workouts` - Tạo buổi tập mới
- `PATCH /api/workouts/:id` - Cập nhật buổi tập
- `DELETE /api/workouts/:id` - Xóa buổi tập

### Exercises
- `GET /api/workouts/:workoutId/exercises` - Lấy tất cả bài tập trong buổi tập
- `POST /api/workouts/:workoutId/exercises` - Thêm bài tập mới
- `PATCH /api/exercises/:id` - Cập nhật bài tập
- `DELETE /api/exercises/:id` - Xóa bài tập
- `GET /api/exercises` - Lấy tất cả bài tập của người dùng

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp cho dự án FitTracker! Để đóng góp:

1. Fork repository
2. Tạo branch cho tính năng mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Hướng dẫn đóng góp

- Tuân thủ quy tắc đặt tên và cấu trúc code hiện tại
- Viết test cho các tính năng mới
- Cập nhật tài liệu nếu cần thiết
- Đảm bảo tất cả test đều pass trước khi gửi PR

## Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Khắc phục sự cố

### Ứng dụng không khởi động

1. Kiểm tra biến môi trường `DATABASE_URL` đã được thiết lập chưa
2. Đảm bảo bạn đã chạy `npm run db:push` để tạo schema cơ sở dữ liệu
3. Kiểm tra log console để xem có lỗi nào không

### Lỗi xác thực

1. Đảm bảo bạn đã đăng nhập vào Replit
2. Kiểm tra lại biến môi trường `REPL_ID`
3. Thử đăng xuất và đăng nhập lại

### Lỗi cơ sở dữ liệu

1. Kiểm tra kết nối mạng
2. Đảm bảo URL cơ sở dữ liệu hợp lệ
3. Kiểm tra xem dịch vụ cơ sở dữ liệu có hoạt động không

### Lỗi build

1. Chạy `npm run check` để kiểm tra lỗi type
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Xóa thư mục `node_modules` và cài đặt lại

## Kiến trúc hệ thống

### Frontend
Frontend được xây dựng với React và TypeScript theo kiến trúc component-based. Các thành phần chính bao gồm:
- Calendar View: Hiển thị lịch tập theo tuần/tháng
- Workout View: Hiển thị chi tiết buổi tập và bài tập
- Exercise Tracking: Theo dõi tiến độ bài tập với bộ đếm và đồng hồ
- Bottom Navigation: Điều hướng di động thân thiện

### Backend
Backend sử dụng Express.js với kiến trúc RESTful API:
- Xác thực qua Replit OpenID Connect
- Quản lý session với PostgreSQL storage
- ORM Drizzle để tương tác cơ sở dữ liệu type-safe
- Middleware logging cho theo dõi request/response

### Cơ sở dữ liệu
Schema cơ sở dữ liệu bao gồm:
- Users: Lưu trữ thông tin người dùng từ Replit auth
- Workouts: Buổi tập với ngày, mô tả và trạng thái hoàn thành
- Exercises: Bài tập với loại, số set/reps, bộ đếm và thời gian nghỉ

## Môi trường phát triển

### Công cụ phát triển
- **Vite**: Development server và build tool
- **TypeScript**: Type checking cho cả frontend và backend
- **Drizzle Kit**: Quản lý schema và migrations
- **ESBuild**: Bundling cho production build

### UI Components
- **shadcn/ui**: Bộ component được xây dựng trên Radix UI
- **Tailwind CSS**: Framework CSS utility-first
- **Lucide React**: Bộ icon consistent

## Tác giả

Dự án được tạo bởi Replit và nhà phát triển NguyenThanhHungDev140503.

## Hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào hoặc có câu hỏi, vui lòng:
1. Kiểm tra phần Khắc phục sự cố trong README này
2. Mở issue trên GitHub repository
3. Liên hệ với developer: nthungdev.140503@gmail.com