import mongoose from 'mongoose';

export async function connectToMongoDB() {
  try {
    console.log(process.env.DB_PASS)
    await mongoose.connect(`mongodb+srv://admin_db_user:${process.env.DB_PASS}@moodledb.ee0sbrm.mongodb.net/MoodleDB`);
    console.log("You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.dir(err.message);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}