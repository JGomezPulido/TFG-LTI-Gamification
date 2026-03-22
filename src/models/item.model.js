import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },
});

ItemSchema.index({curse: 1, name: 1}, {unique: true});

export default mongoose.Model("Item", ItemSchema);