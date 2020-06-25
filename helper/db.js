const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect("mongodb://stunc:sd1234@ds149218.mlab.com:49218/heroku_467c8966", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    const db = mongoose.connection;
    db.on('error', () => {
        console.log("MongoDB bağlantı hatası.");
    });
    db.once('open', () => {
        console.log("MongoDB bağlantı sağlandı.");
    });

    mongoose.Promise = global.Promise;
};

