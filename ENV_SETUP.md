# Environment Setup (Frontend + Backend)

Use these files when running locally or hosting on Vercel.

## 1) Backend env file

Create `backend/.env`:

```env
NODE_ENV=development
PORT=9000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
GMAIL=your-email@gmail.com
APP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:9000
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

Production example:

```env
NODE_ENV=production
PORT=9000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
GMAIL=your-email@gmail.com
APP_PASSWORD=your-app-password
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_PUBLIC_URL=https://your-backend-domain.vercel.app
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## 2) Frontend env file

Create `frontend/webapp/.env`:

```env
VITE_API_BASE_URL=http://localhost:9000
VITE_API_PROXY_TARGET=http://localhost:9000
VITE_UPLOAD_BASE_URL=http://localhost:9000
```

Production example:

```env
VITE_API_BASE_URL=https://your-backend-domain.vercel.app
VITE_API_PROXY_TARGET=https://your-backend-domain.vercel.app
VITE_UPLOAD_BASE_URL=https://your-backend-domain.vercel.app
```

## 3) Start commands

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend/webapp
npm install
npm run dev
```

## 4) Important notes

- Uploaded blog images are served from `/uploads/blog_images/...`.
- Scholarship/internship/leadership images are served by API image routes.
- Frontend now normalizes image URLs and Vite proxies `/uploads` in dev.
