const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    },
})

const Cards = mongoose.model("Card", cardSchema)

module.exports = Cards