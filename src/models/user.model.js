import mongoose from "mongoose";
/*
** Archivo mantenido como referencia para futuro trabajo, aunque ahora está sin utilizar.
*/

/*
** Schema del usuario
** Username, email son autoexplicativos, además de eso, guardamos el rol del usuario
*/
const UserCourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    roles: {
        type: [String],
        required: true,
        trim: true,
    },
    course_id:{
        type: Number,
        required: true,
        unique: true,
    },
});
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    courses: {
        type: [UserCourseSchema],
        required: true,
    },
}, 
{
    timestamps: true,
});
export default mongoose.model("User", userSchema);