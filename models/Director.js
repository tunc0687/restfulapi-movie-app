const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
    fullname: {
        type: String,
        maxlength: 40,
        minlength: 2
    },
    bio: {
        type: String,
        maxlength: 400,
        minlength: 40
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("director", DirectorSchema);
