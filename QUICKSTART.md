# 🚀 UZUM - Tez Boshlash

Siz bilamasangiz ham hammasi tayyor! Faqat boshlang!

## 📥 Qiladigan ishlar

### 1. Node.js o'natish
- https://nodejs.org yuklab oling
- LTS versiyani o'natish
- Tekshirish: `node --version` terminal da

### 2. MongoDB o'natish
- https://www.mongodb.com/try/download/community yuklab oling
- Standart setup bo'yicha o'natish
- Windows Service sifatida run qilish (avtomatik)

### 3. Setup script ishga tushirish (EASY!)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
cd backend
npm install
node seed.js
```

Bu:
- Barcha packages o'natadi
- 12 ta mahsulot qo'shadi database ga
- Admin user yaratadi (admin@uzum.uz / admin123)

### 4. Backend ishga tushirish

Terminal 1:
```bash
cd backend
npm start
```

✅ Ko'rsatiladi: `Server running on http://localhost:5000`

### 5. Frontend ishga tushirish

Terminal 2 (project root da):
```bash
npx http-server
```

Yoki VS Code da:
- Right-click `index.html`
- "Open with Live Server"

✅ Browser ochiladi `http://localhost:8000`

---

## 🎮 Test Qilish

1. Saytga kirish ✅
2. Mahsulotlarni ko'rish ✅
3. Savatga qo'shish ✅
4. Qidirish ✅
5. Kategoriya bo'yicha filter ✅
6. Narx bo'yicha filter ✅

---

## 📊 Nima bo'ldi?

✨ **Frontend** (HTML/CSS/JS):
- Responsive e-commerce sayt
- Savat (localStorage da saqlanadi)
- Qidirish, filter, sorting

🔌 **Backend** (Node.js + Express):
- REST API
- Database (MongoDB)
- Authentication (JWT)
- Product CRUD
- Orders
- Admin panel

🎯 **Integration**:
- Frontend ↔ Backend tuslangan
- Agar backend off bo'lsa → local data
- Agar backend on bo'lsa → real API calls

---

## 🔓 Login

```
Email: admin@uzum.uz
Password: admin123
```

---

## 📱 Mobile

Responsive design - barcha qurilmalarda ishlaydi!

---

## ❓ Problem?

1. Terminal error ko'rib chiq
2. MongoDB ishga tushganmi?
3. Port 5000 banda emasmi?
4. Browser console da error bor-yoqmi?

---

## 📚 Batafsil

Detallar uchun `SETUP.md` va `backend/README.md` o'qiy olasiz.

---

## 🎉 Tayyor!

Hozir siz to'liq e-commerce sayt o'z serverida!

```
Frontend  ← Browser → Backend
                       ↓
                    MongoDB
```

Modify qilib chiq, o'zgartir, o'rgan! 💪
