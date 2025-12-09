// backend/scripts/count.js
require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error('Set MONGO_URI in backend/.env'); process.exit(1); }
  await mongoose.connect(uri);
  const count = await mongoose.connection.db.collection('sales').countDocuments();
  console.log('sales count =', count);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
