const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: [true, "`{PATH}` alanı zorunludur."],
        maxlength: [20, "`{PATH}` alanı maksimum ({MAXLENGTH}) karakter olmalıdır."],
        minlength: [2, "`{PATH}` alanı: ({VALUE}) --> ({MINLENGTH}) karakterden büyük olmalıdır."]
    },
    category: {
        type: String,
        maxlength: 30,
        minlength: 2
    },
    country: {
        type: String,
        maxlength: 30,
        minlength: 2
    },
    year: {
        type: Number,
        max: 2040,
        min: 1900
    },
    imdb_score: {
        type: Number,
        max: 10,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("movie", MovieSchema);