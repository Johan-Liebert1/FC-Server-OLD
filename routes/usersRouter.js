const passport = require('passport')

const express     = require('express'),
      bodyParser  = require('body-parser'),
      usersRouter = express.Router(),
      Users       = require('../models/Users'),
      auth        = require('../auth')


usersRouter.use(bodyParser.json())

// / = /users

//have to do auth.verifyUser first as that will add the user field in req object. 
// just adding auth.verifyAdmin won't work
usersRouter.get('/', auth.verifyUser, auth.verifyAdmin, (req, res) => {
    Users.find({})
    .then(users => res.json(users))
    .catch(err => console.log(err))
})

usersRouter.post('/signup', (req, res) => {
    let new_user = new Users({username: req.body.username})
    Users.register(new_user, req.body.password, (err, user) => {
        if(err)
            res.json({err: err})

        else{
            if(req.body.firstname)
                user.firstname = req.body.firstname

            if(req.body.lastname)
                user.lastname = req.body.lastname
            
            user.save((err, user2) => {
                if (err)
                    res.json({err: err})
            })

            passport.authenticate('local')(req, res, ()=> {
                res.json({success: true, status: "Registration Successful"})
            })
        }   

    })
})

usersRouter.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        
        if(err)
            return next(err)
        
        if(!user){
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            res.json({success: false, status: "Login Unsuccessful ", err: info})
        }

        req.logIn(user, (err) => {
            if (err){
                res.statusCode = 401
                res.setHeader("Content-Type", "application/json");
                res.json({success: false, status: "Login Unsuccessful", err: "Could not login the user"})
            }

            const token = auth.getToken({_id: req.user._id})
            console.log("inside login route, req.user: ", req.user)
            res.json({success: true, status: "LogIn Successful", token: token})
        })
    })(req, res, next)
})

module.exports = usersRouter