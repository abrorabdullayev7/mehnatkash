// Seed Database Script
// Ishga tushirish: node seed.js

const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

// Generate 100 products
function generateProducts() {
  const categories = ['telefon', 'elektronika', 'kitoblar', 'kiyim', 'oziq', 'sog'];
  const productNames = {
    telefon: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Motorola', 'Google Pixel'],
    elektronika: ['Laptop', 'Monitor', 'Quloqchin', 'Kamera', 'Printer', 'Router', 'SSD', 'RAM'],
    kitoblar: ['Hayot filosofiyasi', 'Biznes uchun', 'Psixologiya', 'Marketing', 'Dasturlash'],
    kiyim: ['T-shirt', 'Shirtlar', 'Shim', 'Jaket', 'Sport Kiyim', 'Ayakki', 'Shlyapa'],
    oziq: ['Banan', 'Olma', 'Apelsin', 'Pasta', 'Suv', 'Choy', 'Kofe'],
    sog: ['Vitamin', 'Oqsh', 'Sport qurol', 'Yoga Mat', 'Fitnes']
  };

  const products = [];
  let id = 1;

  const images = [
    "https://avatars.mds.yandex.net/i?id=93c3b43d0c4196f321ebde37c94422f354ec07a5-6177852-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=3ba7265d657e275ee4d7f76a25231cb081e53989-5341819-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=10cb736559d4583fbad63da81e46efa4953dfbe5-5343653-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=ec5e3cdcc65d6c3cb1b84ee762dd07e58d0fd500-4985796-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=ad3b462dffe417af902a5227b6a193d6d0135360-17742983-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=3456b7efd08a85e08af7f8854783ae246bd8d8d5-3858847-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=6b663ddf8cef75c1d2018ac74c960ec8b6d1d6e1-4360605-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=b093afe403df21c9e8c1dbe9b251e7772467a49b-4120598-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=38791ff9b9f72f2789941423c04fa60f070cdb2d-5661819-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=3e895e10444d2dea064b7da170cfa6e76b0bd46a-5335451-images-thumbs&n=13",
  ];

  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = productNames[category];
    const name = names[Math.floor(Math.random() * names.length)];
    const price = Math.floor(Math.random() * 40000000) + 100000;
    const oldPrice = price + Math.floor(Math.random() * 5000000) + 1000000;
    const image = images[Math.floor(Math.random() * images.length)];
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const stock = Math.floor(Math.random() * 500) + 10;

    products.push({
      name: `${name} #${i + 1}`,
      description: `Yuqori sifatli ${category} mahsulot. Korish va test qilish uchun mahkam tafsiya etiladi. ${i + 1} raqamli edishun.`,
      price,
      oldPrice,
      image,
      category,
      stock,
      rating: parseFloat(rating),
      isActive: true
    });
  }

  return products;
}

const seedAdmin = {
  name: "Admin",
  email: "admin@uzum.uz",
  password: "admin123",
  phone: "+998901234567",
  role: "admin"
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uzum');
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ role: 'admin' });
    console.log('🧹 Cleared old data');

    // Generate and seed 100 products
    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added`);

    // Seed admin user
    await User.create(seedAdmin);
    console.log('✅ Admin user created (admin@uzum.uz / admin123)');

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
