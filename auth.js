const passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      JwtStrategy   = require('passport-jwt').Strategy,
      ExtractJwt    = require('passport-jwt').ExtractJwt,
      jwt           = require('jsonwebtoken'),
      User          = require('./models/Users')


const secretKey = 'SecretKey'  

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser((user) => {console.log("user in serializeUser: ", user)}))
passport.deserializeUser(User.deserializeUser((user) => {console.log("user in deserializeUser: ", user)}))


var opts = {}
opts.secretOrKey = secretKey
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

exports.jwtPassport = passport.use(new JwtStrategy (opts , (jwt_payload, done) => {
    // console.log("JWT Payload: ", jwt_payload)
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err){
            return done(err, false); // 2nd parameter is to denote that the user doesn't exist
        }

        else if (user){
            return done(null, user); // null as no error 
        }

        else{
            return done(null, false);
        }
    })
}))


exports.getToken = (user) => {
    return jwt.sign(user, secretKey, {expiresIn: 36000})
}

exports.verifyUser = passport.authenticate('jwt', {session: false})

exports.verifyAdmin = (req, res, next) => {
    console.log(req.user)
    if (req.user.isAdmin) {
        next()
    }
    else{
        res.send("You are not authorized to perform this action")
    }
}

