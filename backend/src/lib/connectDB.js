import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MongoDB_URI);
    console.log("database connected : " + connection.connection.host);
  } catch (error) {
    console.log("database connection error: " + error);
  }
};

export default connectDB;
