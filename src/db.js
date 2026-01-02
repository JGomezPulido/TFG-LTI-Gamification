import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost/moodledb");
        console.log(">>> DB is connected");
    } catch
    {
        console.log(error);
    }
}