# Spa Renew Admin Panel

Admin Panel cho website Spa Renew được xây dựng với React, Vite và Mantine UI.

## Tính năng

- **Quản lý dịch vụ**: Thêm, sửa, xóa các dịch vụ spa với hỗ trợ đa ngôn ngữ
- **Quản lý bài viết**: Viết và quản lý blog với hỗ trợ đa ngôn ngữ
- **Quản lý tin nhắn**: Xem và phản hồi tin nhắn từ khách hàng
- **Quản lý cài đặt**: Cấu hình thông tin liên hệ, mạng xã hội và nội dung đa ngôn ngữ
- **Xác thực**: Đăng nhập an toàn với JWT

## Công nghệ sử dụng

- **React**: Thư viện UI
- **Vite**: Build tool hiệu suất cao
- **Mantine UI**: Framework UI hiện đại
- **React Router**: Quản lý định tuyến
- **Axios**: Gọi API
- **JWT**: Xác thực người dùng

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy ứng dụng ở môi trường phát triển:

```bash
npm run dev
```

## Kết nối với API

Admin Panel được thiết kế để kết nối với Spa Renew API Server. Đảm bảo API Server đang chạy tại `http://localhost:5000`.

Cấu hình kết nối API được đặt trong file `src/utils/axiosConfig.ts`.

## Ngôn ngữ hỗ trợ

Admin Panel hỗ trợ quản lý nội dung đa ngôn ngữ với các ngôn ngữ:

- Tiếng Anh (mặc định)
- Tiếng Việt (vi)
- Tiếng Trung (zh)
- Tiếng Hàn (ko)
- Tiếng Nga (ru)

## Cấu trúc thư mục

```
admin/
├── public/             # Tài nguyên tĩnh
├── src/
│   ├── components/     # Các component có thể tái sử dụng
│   ├── contexts/       # Context API (xác thực, đa ngôn ngữ)
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Các layout chung
│   ├── pages/          # Các trang chính
│   ├── services/       # Kết nối API
│   ├── store/          # State management
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Tiện ích và hàm helper
│   ├── App.tsx         # Component ứng dụng chính
│   └── main.tsx        # Entry point
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Build cho Production

Để build ứng dụng cho môi trường production:

```bash
npm run build
```

Các file build sẽ được tạo trong thư mục `dist`.
