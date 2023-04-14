const {model, Schema} = require("../db/connection")

const DreamSchema = new Schema({
    text: String,
    user: {type: Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true})

const Dream = model("Dream", DreamSchema)

module.exports = Dream