const mongoose = require('mongoose')

const setSchema = new mongoose.Schema({
    setName: {
        type: String,
        required: true,
        unique: true
    },

    setId: {
        type: String
    },

    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card'
        }
    ]
}) 

var CardSets = mongoose.model("CardSet", setSchema)

module.exports = CardSets