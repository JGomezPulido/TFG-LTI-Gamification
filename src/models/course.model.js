import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",

    },
    courseID: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model("Course", CourseSchema);