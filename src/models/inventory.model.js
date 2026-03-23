import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [{
            _id: false,
            item: { 
                autoIndex: false,
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            count: {
                type: Number,
                default: 0,

            }
    }],
});

InventorySchema.index({course: 1, user: 1}, {unique: true});

export default mongoose.model("Inventory", InventorySchema);