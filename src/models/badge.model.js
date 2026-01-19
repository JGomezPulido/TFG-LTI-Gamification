import mongoose from "mongoose"
//Para hostear las insignias en nuestra BBDD, usaremos el schema de BadgeClass definido en el standard OpenBadges 2.0, que se puede comprobar en https://www.imsglobal.org/sites/default/files/Badges/OBv2p0Final/index.html

const AlignmentSchema = new mongoose.Schema({
    targetName: {
        type: String,
        trim: true,
        required: true,
    },
    targetUrl: {
        type: String,
        trim: true,
        required: false,
    },
    targetDescription: String,
    targetCode: String,
    targetFramework: String,

});

const BadgeClassSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        default: "BadgeClass",
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        trim: false,
    },
    issuer: {
        type: String,
        required: true,
        trim: true
    },
    criteria: {
        type: String,
        required: true,
        trim: true,
    },
    tags: [String],
    alignment: AlignmentSchema

},
{
    timestamps: true,
})

export default mongoose.model("BadgeClass", BadgeClassSchema);