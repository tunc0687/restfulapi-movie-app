const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Models
const Director = require("../models/Director");
const Movie = require("../models/Movie");

// Yeni Director ekler
router.post("/", (req, res, next) => {
    const director = new Director(req.body);
    const promise = director.save();
    promise.then(director => res.json(director))
        .catch(err => res.json(err));
});

// // Tüm Directorları getirir
// router.get("/", (req, res, next) => {
//     const promise = Director.find({});
//     promise.then(director => res.json(director))
//         .catch(err => res.json(err));
// });

// Tüm Directorları movie leri ile birlite getirir
router.get("/", (req, res, next) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: "movies",
                localField: "_id",
                foreignField: "director_id",
                as: "movies"
            }
        },
        // {
		// 	$unwind: {
		// 		path: '$movies',
		// 		preserveNullAndEmptyArrays: true
		// 	}
		// },
        // {
        //     $project: {
        //         _id: true,
        //         fullname: true,
        //         bio: true,
        //         movies: "$movies"
        //     }
        // }
    ]);
    promise.then(director => res.json(director))
        .catch(err => res.json(err));
});


// Directorun imdb score a göre top10 movie sini getirir
router.get('/:director_id/best10movie', (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;
    if (req.params.director_id.match(mongodbregex)) {
        const promise = Movie.find({director_id: req.params.director_id})
            .sort({imdb_score: -1})
            .limit(10);
        promise.then(movie => {
            if (movie.length === 0) {
                next({ message: "No such movie found by this director!" });
            } else {
                res.json(movie);
            }
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
    
});


// Id si girilen Directoru movie leri ile birlite getirir
router.get("/:director_id", (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;

    if (req.params.director_id.match(mongodbregex)) {
        const promise = Director.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.director_id)
                }
            },
            {
                $lookup: {
                    from: "movies",
                    localField: "_id",
                    foreignField: "director_id",
                    as: "movies"
                }
            }
        ]);
        promise.then(director => {
            if (director.length === 0) {
                next({ message: "The director is not found!" });
            } else {
                res.json(director[0]); 
            }
            
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
    
});


// Id ye göre istenen directorü bulup güncellemek için kullanılır
router.put('/:director_id', (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;

    if (req.params.director_id.match(mongodbregex)) {
        const promise = Director.findByIdAndUpdate(req.params.director_id, req.body, {new: true});
        promise.then(director => {
            if (!director) {
                next({ message: "The director is not found!" });
            } else {
                res.json(director); 
            }
            
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
});

// Id ye göre istenen directorü bulup silmek için kullanılır
router.delete('/:director_id', (req, res, next) => {
    const mongodbregex = /^[0-9a-fA-F]{24}$/;

    if (req.params.director_id.match(mongodbregex)) {
        const promise = Director.findByIdAndRemove(req.params.director_id);
        promise.then(director => {
            if (!director) {
                next({ message: "The director is not found!" });
            } else {
                res.json({status: 1}); 
            }
            
        }).catch(err => res.json(err));
    } else {
        next({ message: "Geçerli bir id diriniz." });
    }
});






module.exports = router;