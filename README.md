# todo-web

NextJS (App Router) gọi `todo-api`.

| Lệnh | Việc |
|---|---|
| `npm ci` | Cài đúng version trong `package-lock.json` |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm run build` | Build production |
| `npm run dev` | Chạy dev ở http://localhost:3000 (đọc `.env.local`) |

| Build arg (`docker build --build-arg`) | Ví dụ |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8081` |
| `NEXT_PUBLIC_APP_ENV` | `dev` / `test` / `prod` — đổi màu thanh trên cùng |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` |

⚠️ `NEXT_PUBLIC_*` được gắn vào JS **lúc build**, không phải lúc chạy.

Hướng dẫn thực hành: [`../HUONG-DAN-LEVEL-1.md`](../HUONG-DAN-LEVEL-1.md)
