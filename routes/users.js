var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require("../models/user.js")


router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/login', (req, res, next) => {
    var errors = [];
    // console.log(req.body);
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then((user) => {
            if (!user) {
                errors.push({ msg: "Kindly signup first as user doesn't exist or username incorrect" })
                render('login', {
                    errors: errors
                });
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        res.render('dashboard', {
                            userId: user.email
                        }
                        );
                    } else {
                        errors.push({ msg: "incorrect passsword" });
                        res.render('login', {
                            errors: errors
                        })

                    }
                })
            }

        })
        .catch((err) => {
            console.log(err);
            errors.push({ msg: "Kindly try again as some error occured" });
            res.render('login', {
                errors: errors
            })
        })


})

router.post('/signup', (req, res) => {
    // console.log(req.body);
    const { email, username, password, password2 } = req.body;
    let errors = [];
    // console.log(' username ' + username + ' email :' + email + ' pass:' + password);
    if (!username || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }
    //check if match
    if (password !== password2) {
        errors.push({ msg: "passwords dont match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({ msg: "passwords dont match" });

    }
    if (errors.length > 0) {
        res.render('signup', {
            errors: errors
        })
    } else {
        //validation passed
        User.findOne({ email: email }).exec((err, user) => {
            // console.log(user);
            if (user) {
                res.redirect('/users/login');
            } else {
                const newUser = new User({
                    username: username,
                    email: email,
                    password: password
                });
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    // console.log(value)
                                    res.render('login', {
                                        errors: [{ msg: "registration Successfull" }]
                                    });
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Now logged out');
    res.redirect('/users/login');
})

module.exports = router