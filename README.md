# DOAN-CK-NMCNPM

This repository contains a web application for managing football tournaments.

Folders:

- `client/` — Frontend (React + Vite)
- `server/` — Backend (Node.js + Express + Prisma + MySQL)

## Quick Start (cross-platform)

1. Start the backend

```bash
cd server
npm install
# generate prisma client (xem ghi chú bên dưới nếu shell của bạn chặn npx)
npx prisma generate
# start server
node server.js
```

- Chạy cùng lệnh trong Command Prompt (cmd.exe) thay vì PowerShell.
- Hoặc dùng `npm exec prisma generate` (tương thích npm >= 7):

```bash
npm exec prisma generate
```

- Hoặc thêm script vào `server/package.json` và chạy `npm run prisma:generate`:

```json
"scripts": {
	"prisma:generate": "prisma generate"
}
```

2. Start the frontend

```bash
cd client
npm install
npm run dev
```

Open the frontend in your browser (default Vite URL) and ensure the backend is running at `http://localhost:3000` (hoặc cổng bạn cấu hình).

See `server/README.md` and `client/README.md` for full, cross-platform instructions and troubleshooting tips.
