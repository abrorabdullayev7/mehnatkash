# UZUM E-commerce Setup Guide

To'liq frontend + backend setup uchun qo'llanma ✨

## 📋 Qo'rish

- Frontend: HTML, CSS, JavaScript (barcha brauzerlarda ishlaydi)
- Backend: Node.js + Express + MongoDB
- API: REST
- Frontend va Backend ikkisiham ishlaydigan

---

## 🔧 Setup Steps

### 1️⃣ MongoDB O'natish

#### Option A: Local MongoDB (Tavsiya)
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) yuklab oling
2. Windows da `.msi` file bo'yicha o'natish (yoki Mac/Linux da)
3. Standart setup bo'yicha install qiling (port 27017)
4. MongoDB Service ishga tushurilgan bo'lishi kerak

#### Option B: MongoDB Atlas (Cloud)
1. https://www.mongodb.com/cloud/atlas ga o'ting
2. Free account ochish
3. Database yaratish
4. Connection string olish
5. `.env` failda `MONGODB_URI` o'zgartirish

---

### 2️⃣ Backend Setup

**Terminal 1 da:**

```bash
cd backend
npm install
```

#### Environment sozlamalari (.env file)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/uzum
JWT_SECRET=your-secret-key-12345
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_PUBLIC_KEY=pk_test_dummy
FRONTEND_URL=http://localhost:3000
```

#### Database ga ma'lumot qo'shish
```bash
node seed.js
```

Bu 12 ta mahsulot va admin user qo'shadi:
- Email: `admin@uzum.uz`
- Password: `admin123`

#### Backend ishga tushirish
```bash
npm start
```

Ho'l bo'lsa:
```bash
npm run dev
```

✅ Server `http://localhost:5000` da ishga tushatadi

---

### 3️⃣ Frontend Setup

**Terminal 2 da:**

```bash
cd ..
```

Frontend fayllari allaqachon tayyor:
- `index.html`
- `style.css`
- `api.js` (Backend bilan bog'lanuvchi)
- `app.js`

#### Frontend ishga tushirish
```bash
npx http-server
```

Yoki Python server:
```bash
python -m http.server 8000
```

Yoki VS Code Live Server:
- Right-click `index.html`
- "Open with Live Server"

✅ Frontend `http://localhost:8000` (yoki boshqa port) da ochiladi

---

## 🔌 API Integration

Frontend allaqachon backend bilan bog'langan! (`api.js` fayl orqali)

- Backend ishga tushsa ✅ → Boshqa API calls
- Backend ishga tushmagansa ❌ → Local data + localStorage

---

## 🧪 Test Qilish

### Login
```
Email: admin@uzum.uz
Password: admin123
```

### API Test (curl)
```bash
# Products olish
curl http://localhost:5000/api/products

# Health check
curl http://localhost:5000/api/health
```

---

## ⚡ Frontend Features

✅ Kategoriya bo'yicha filtir
✅ Qidirish
✅ Narx bo'yicha filter
✅ Sorting (arzani, qimmatini, yangib)
✅ Savat (localStorage da saqlanadi)
✅ Responsive dizayn

---

## 🔐 Backend Features

✅ Authentication (JWT)
✅ User registration/login
✅ Products CRUD
✅ Cart management
✅ Order management
✅ Admin dashboard
✅ Payment (Stripe)

---

## 📁 File Structure

```
uzum project/
├── index.html          (Main page)
├── style.css           (Styles)
├── api.js              (API calls)
├── app.js              (Frontend logic)
├── krosovka.html       (Product detail)
├── backend/
│   ├── server.js       (Main server)
│   ├── package.json    (Dependencies)
│   ├── .env            (Environment)
│   ├── seed.js         (Database seed)
│   ├── models/         (Database schemas)
│   ├── controllers/    (Business logic)
│   ├── routes/         (API endpoints)
│   ├── middleware/     (Auth, etc)
│   └── README.md       (Backend docs)
└── README.md           (This file)
```

---

## 🐛 Troubleshooting

### Backend connection error
- MongoDB ishga tushganmi?
- Port 5000 band emasmi?
- Terminal da error bor-yoqmi?

### Frontend not loading
- Live server ishga tushganmi?
- Browser console da error bor-yoqmi?

### Database error
- MongoDB connection string to'g'rimi?
- `.env` file to'g'rimi?
- `seed.js` chalashtimi?

---

## 🚀 Production Deployment

### Heroku (Backend)
1. `Procfile` yaratish
2. `package.json` sozlamalari
3. `heroku login`
4. `heroku create`
5. `git push heroku main`

### Vercel/Netlify (Frontend)
1. `index.html`, `style.css`, `api.js`, `app.js` yuklar
2. API URL o'zgartirish (environment variables)
3. Deploy

---

## 📞 Support

Agar savol bo'lsa, console loglarni ko'rib chiqing 👀

Happy coding! 🎉
