import mongoose from "mongoose";
//Para hostear las insignias en nuestra BBDD, usaremos el schema de BadgeClass definido en el standard OpenBadges 2.0, que se puede comprobar en https://www.imsglobal.org/sites/default/files/Badges/OBv2p0Final/index.html, me salto algunos parámetros como issuer o type, porque son parametros que son fijos e inyectaré en las comunicaciones externas, pero no son necesarios para la bbdd

const AlignmentSchema = new mongoose.Schema({
    _id: false,
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
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
    criteria: {
        type: String,
        required: true,
        trim: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    tags: [String],
    alignment: AlignmentSchema
},
{
    timestamps: true,
});

export default mongoose.model("BadgeClass", BadgeClassSchema);