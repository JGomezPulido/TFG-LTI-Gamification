import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
    _id: false,
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        autoIndex: false,
    },
    amount: {
        type: Number,
        required: true,
        autoIndex: false,
    }
});

const MissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    enabled: {
        type: Boolean,
        required: true,
        default: false,
    },

    rewards: {
        type: [RewardSchema],
        required: true,
        validate: {
            validator: v => { return v == null || v.length > 0;},
            message: "There must be at least one reward for a mission"
        },
    }
});


MissionSchema.index({course: 1, name: 1}, {unique: true});
export default mongoose.model("Mission", MissionSchema);