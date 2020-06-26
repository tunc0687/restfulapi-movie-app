const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

// Models
const User = require("../models/User")

router.get('/', (req, res, next) => {
    res.json({title: 'Express'});
});


router.post('/register', (req, res, next) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                username,
                password: hash
            });
            const promise = user.save();
            promise.then(data => res.json(data))
                .catch(err => res.json(err));
        }).catch(err => res.json(err));
});


router.post("/authenticate", (req, res, next) => {
    const {username, password} = req.body;
    const promise = User.findOne({username});
    promise.then(user => {
        if (!user) {
            res.json({
                status: false,
                message: "Authentication failed, user not found."
            });
        } else {
            bcrypt.compare(password, user.password)
                .then(result => {
                    if (!result) {
                        res.json({
                            status: false,
                            message: "Authentication failed, wrong password!"
                        });
                    } else {
                        const payload = {
                            username
                        };
                        const token = jwt.sign(
                            payload,
                            req.app.get("api_secret_key"),
                            {
                                expiresIn: 720 // 12 saat
                            }
                        );
                        res.json({
                            token,
                            status: true
                        });
                    }
                })
                .catch(err => res.json(err));

        }
    }).catch(err => res.json(err));
});

module.exports = router;