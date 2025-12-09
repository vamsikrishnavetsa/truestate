const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI; // mongodb+srv://username:pw@cluster.../dbname
  if (!uri) throw new Error('MONGO_URI env var not set');

  // Recommended options — mongoose 7+ removes need for many options
  await mongoose.connect(uri, {
    // options if needed
  });
  console.log('Connected to MongoDB Atlas');
}

module.exports = connectDB;
