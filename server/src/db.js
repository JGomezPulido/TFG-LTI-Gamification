import mongoose from "mongoose"
/*
** Archivo mantenido como referencia para futuro trabajo, aunque ahora está sin utilizar.
*/
export const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost/moodledb");
        console.log(">>> DB is connected");
    } catch
    {
        console.log(error);
    }
}