const express = require('express');
const router = express.Router();

const Movie = require("../models/Movie");

// Yeni movie ekle
router.post('/', (req, res, next) => {
    const movie = new Movie(req.body);
    const promise = movie.save();
    promise.then(data => res.json(data))
        .catch(err => res.json(err));
});

// // Tüm movie leri getir
// router.get('/', (req, res, next) => {
//     const promise = Movie.find({});
//     promise.then(data => res.json(data))
//         .catch(err => res.json(err));
// });


// Tüm movie leri getir
router.get("/", (req, res, next) => {
    const promise = Movie.aggregate([
        {
            $lookup: {
                from: "directors",
                localField: "director_id",
                foreignField: "_id",
                as: "director"
            }
        }
    ]);
    promise.then(director => res.json(director))
        .catch(err => res.json(err));
});


// imdb score a göre top10 movie yi getirir
router.get('/top10', (req, res, next) => {
    const promise = Movie.find({})
        .sort({imdb_score: -1})
        .limit(10);
    promise.then(data => res.json(data))
        .catch(err => res.json(err));
});

// Between year
router.get('/between/:start_year/:end_year', (req, res, next) => {
    const {start_year, end_year} = req.params;
    const promise = Movie.find(
        {
            year: {"$gte" : start_year , "$lte" : end_year }
        }
    );
    promise.then(data => res.json(data))
        .catch(err => res.json(err));
});

// Id ye göre istenen movie yi getir
router.get('/:movie_id', (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;

    if (req.params.movie_id.match(mongodbregex)) {
        const promise = Movie.findById(req.params.movie_id);
        promise.then(movie => {
            if (!movie) {
                next({ message: "The movie is not found!" });
            } else {
                res.json(movie); 
            }
            
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
});

// Id ye göre movie yi bulup güncellemek için kullanılır
router.put('/:movie_id', (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;

    if (req.params.movie_id.match(mongodbregex)) {
        const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, {new: true});
        promise.then(movie => {
            if (!movie) {
                next({ message: "The movie is not found!" });
            } else {
                res.json(movie); 
            }
            
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
});

// Id ye göre movie yi silmek için kullanılır
router.delete('/:movie_id', (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;

    if (req.params.movie_id.match(mongodbregex)) {
        const promise = Movie.findByIdAndRemove(req.params.movie_id);
        promise.then(movie => {
            if (!movie) {
                next({ message: "The movie is not found!" });
            } else {
                res.json({status : 1}); 
            }
            
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
});



module.exports = router;