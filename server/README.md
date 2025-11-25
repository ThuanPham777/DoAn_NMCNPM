# Backend (server)

Ứng dụng backend sử dụng Node.js + Express và Prisma làm ORM để kết nối tới MySQL.

# Backend (server)

Ứng dụng backend sử dụng Node.js + Express và Prisma làm ORM kết nối tới MySQL.

## Yêu cầu

- Node.js (đề xuất LTS)
- MySQL database

- Node.js (đề xuất LTS)
- MySQL database

## Cấu trúc chính

- `server/app` - các module theo chức năng (users, teams, matches,...)
- `server/prisma` - chứa `schema.prisma`
- `server/server.js` - entry point
- `server/.env` - biến môi trường (DATABASE_URL, JWT_SECRET, ...)

- `server/app` - các module theo chức năng (users, teams, matches,...)
- `server/prisma` - chứa `schema.prisma`
- `server/server.js` - entry point
- `server/.env` - biến môi trường (DATABASE_URL, JWT_SECRET, ...)

## Cài đặt & chạy

1. Vào thư mục `server`:

```bash
cd server
```

cd server

````

2. Cài phụ thuộc:

```bash
npm install
````

```powershell
npm install
```

3. Thiết lập biến môi trường: sao chép `.env.example` (nếu có) thành `.env` và cập nhật `DATABASE_URL`, `PORT`, `JWT_SECRET`...

4. Sinh Prisma client (bắt buộc khi thay đổi `schema.prisma`):

5. Sinh Prisma client (bắt buộc khi thay đổi `schema.prisma`):

npx prisma generate

````
npx prisma generate

```cmd
cd server
npx prisma generate
````

````

5. Chạy server:


```bash
node server.js
# hoặc
npm run start
````

node server.js

```cmd
node server.js
```

```


Server mặc định lắng nghe `http://localhost:3000`.
```
