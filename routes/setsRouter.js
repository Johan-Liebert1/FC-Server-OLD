const express    = require("express"),
      CardSets   = require("../models/CardSets"),
      setRouter  = express.Router(),
      bodyParser = require("body-parser");

setRouter.use(bodyParser.json())

// /sets
setRouter.route('/')

.get((req, res) => {
    CardSets.find({})
    .then(cardSets => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json")
        res.json(cardSets);
    })
    .catch(err => console.log(err))
})

.post((req, res) => {
    CardSets.create(req.body)
    .then(cardSet => {

        let setId = cardSet.setName.toLowerCase().replace(" ", "-")
        cardSet.updateOne({
            $set : {setId: setId}
        }, {upsert: true})
        //upsert - if set to true and no record matched to the query, replacement object is inserted as a new record.
        
        .then(newCardSet => res.json(newCardSet)).catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})


setRouter.route('/:setId/cards')

.get((req, res) => {
    CardSets.findById(req.params.setId)
    .then(cards => {
        res.statusCode = 200
        res.setHeader("Content-Type", 'application/json')
        res.json(cards)
    })
    .catch(err => console.log(err))
})


module.exports = setRouter