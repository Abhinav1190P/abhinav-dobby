const bcrypt = require("bcryptjs");
const { model, Schema } = require("mongoose");

const imageSchema = new Schema({
    image_url: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {

    versionKey: false,
    timestamps: true,

})

module.exports = model("image", imageSchema);