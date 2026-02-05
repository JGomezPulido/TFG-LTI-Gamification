import mongoose from "mongoose";

const UserCourseSchema = new mongoose.Schema({
    _id: false,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        unique: true,
        required: true,
        autoIndex: false,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
});

const UserAssertionSchema = new mongoose.Schema({
    _id: false,
    badge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BadgeClass",
        required: true,
        unique: true,
        autoIndex: false,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }]
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    roles: {
        type: [UserCourseSchema]
    },
    assertions: {
        type: [UserAssertionSchema]
    }
}, 
{
    timestamps: true,
});

export default mongoose.model("User", UserSchema);