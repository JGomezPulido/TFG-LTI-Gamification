import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
});

ItemSchema.index({course: 1, name: 1}, {unique: true});

export default mongoose.model("Item", ItemSchema);