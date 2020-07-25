const express    = require("express"),
      CardSets   = require("../models/CardSets"),
      setRouter  = express.Router(),
      bodyParser = require("body-parser");

setRouter.use(bodyParser.json())

// /sets
setRouter.route('/')

.get((req, res) => {
    CardSets.find({}).populate('cards')
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

.put((req, res) => {
    res.send(`PUT not supported on this route`)
})

.delete((req, res) => {
    CardSets.deleteMany({})
    
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    }, (err) => next(err))

    .catch((err) => next(err));
})


setRouter.route('/:setId')

.get((req, res) => {
    CardSets.findOne({setId: req.params.setId}).populate('cards')
    .then(set => {
        if (set !== null){
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json");
            res.json(set)
        }
        else{
            res.send(`The set with setId: '${setId}' does not exist`)
        }
    })
    .catch(err => console.log(err))
})

.post((req, res) => {
    res.send(`POST not supported on this route`)
})

.put((req, res) => {
    // only setName can be updated here
    let newSetId = req.body.setName.toLowerCase().replace(" ", "-")
    CardSets.findOneAndUpdate({setId: req.params.setId}, {
        $set: {setName: req.body.setName, setId: newSetId}
    }, {new: true})
    .then(newSet => {
        res.json(`Updated Set: ${newSet}`)
    })
    .catch(err => console.log(err))
})

.delete((req, res) => {
    CardSets.findOneAndDelete({setId: req.params.setId})
    .then(new_sets => {
        res.send(`Deleted Successfully`)
        
    })
    .catch(err => console.log(err))
})

module.exports = setRouter