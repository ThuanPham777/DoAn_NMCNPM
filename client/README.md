# Frontend (client)

Ứng dụng frontend được xây dựng bằng Vite + React — giao diện quản lý giải đấu, đội, cầu thủ, lịch thi đấu...

## Yêu cầu

- Node.js (LTS) và npm hoặc yarn

## Cài đặt & chạy

1. Vào thư mục `client`:

```bash
cd client
```

2. Cài phụ thuộc:

```bash
npm install
# hoặc
# yarn install
```

3. Chạy môi trường phát triển:

```bash
npm run dev
```

Frontend mặc định chạy trên `http://localhost:5173` (với cấu hình Vite mặc định). API backend mặc định được cấu hình ở `http://localhost:3000` — nếu backend chạy trên cổng khác thì cập nhật URL API trong code (`client/src` hoặc biến môi trường).
