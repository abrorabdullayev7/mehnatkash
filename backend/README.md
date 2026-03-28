# UZUM E-commerce Backend API

Node.js + Express + MongoDB bilan yozilgan to'liq e-commerce backend.

## 🚀 O'rnatish

### 1. Dependencies o'natish
```bash
cd backend
npm install
```

### 2. MongoDB o'natish
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) yuklab oling va o'natish
- Yoki [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) dan foydalaning

### 3. .env file sozlash
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uzum
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
FRONTEND_URL=http://localhost:3000
```

### 4. Server ishga tushirish
```bash
npm start
```
Yoki development uchun:
```bash
npm run dev
```

## 📚 API Endpoints

### Auth
- **POST** `/api/auth/signup` - Ro'yxatdan o'tish
- **POST** `/api/auth/login` - Kirish
- **GET** `/api/auth/profile` - Profil (Protected)

### Products
- **GET** `/api/products` - Barcha mahsulotlar
- **GET** `/api/products/:id` - Bir mahsulot
- **POST** `/api/products` - Mahsulot yaratish (Admin)
- **PUT** `/api/products/:id` - Mahsulot o'zgartirish (Admin)
- **DELETE** `/api/products/:id` - Mahsulot o'chirish (Admin)

### Cart
- **GET** `/api/cart` - Savatni ko'rish (Protected)
- **POST** `/api/cart/add` - Savatga qo'shish (Protected)
- **PUT** `/api/cart/update` - Savatni o'zgartirish (Protected)
- **DELETE** `/api/cart/remove/:productId` - Savatdan o'chirish (Protected)
- **DELETE** `/api/cart/clear` - Savatni tozalash (Protected)

### Orders
- **POST** `/api/orders` - Buyurtma yaratish (Protected)
- **GET** `/api/orders/my-orders` - Mening buyurtmalarim (Protected)
- **GET** `/api/orders/:id` - Buyurtmani ko'rish (Protected)
- **PUT** `/api/orders/:id/status` - Status o'zgartirish (Admin)

### Admin
- **GET** `/api/admin/dashboard` - Dashboard (Admin)
- **GET** `/api/admin/orders` - Barcha buyurtmalar (Admin)
- **GET** `/api/admin/users` - Barcha foydalanuvchilar (Admin)
- **PUT** `/api/admin/users/:id` - Foydalanuvchini o'zgartirish (Admin)
- **DELETE** `/api/admin/users/:id` - Foydalanuvchini o'chirish (Admin)

### Payment (Stripe)
- **POST** `/api/payment/create-payment-intent` - To'lov yaratish
- **POST** `/api/payment/confirm-payment` - To'lovni tasdiqlash

## 🔐 Authentication

JWT token orqali autentifikatsiya:
```
Header: Authorization: Bearer <token>
```

## 📦 Technologies

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing

## 🛠 Features

✅ User registration & login
✅ Product CRUD operations
✅ Shopping cart management
✅ Order management
✅ Admin dashboard
✅ Payment gateway integration (Stripe)
✅ Role-based access control

## 📝 License

MIT
