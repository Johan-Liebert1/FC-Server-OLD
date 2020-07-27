const mongoose              = require('mongoose')
      passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: ''
    },

    lastname: {
        type: String, 
        default: ''
    },

    isAdmin : {
        type: Boolean,
        default: false
    },

    
    cardsets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CardSet'
        }
    ]
})

userSchema.plugin(passportLocalMongoose); // this will automatically add support for username and password

const User = mongoose.model("User", userSchema)

module.exports = User