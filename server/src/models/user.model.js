import mongoose from "mongoose";

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
        type: [{
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                //unique: true,
                required: true,
                autoIndex: false,
            },
            role: {
                type: String,
                required: true,
                trim: true,
                autoIndex: false,
            },
            _id: false,
        }]
    },
    assertions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BadgeClass',
    }]
}, 
{
    timestamps: true,
});

export default mongoose.model("User", UserSchema);