const express    = require("express"),
      CardSets   = require("../models/CardSets"),
      Users      = require('../models/Users')
const Cards = require("../models/Cards")
      setRouter  = express.Router(),
      bodyParser = require("body-parser"),
      auth       = require('../auth')

setRouter.use(bodyParser.json())

// /:username/sets

setRouter.route('/')

.get(auth.verifyUser, (req, res) => {
    // console.log('req.user._id in /:username/sets: ', req.user._id)
    Users.findById(req.user._id).populate('cardsets')
    .then(user => {
        
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json")
        res.json(user);
        
        
    })
    
    .catch(err => console.log(err))
})

.post(auth.verifyUser, (req, res) => {

    Users.findById(req.user._id).populate('cardSets')

    .then(user => {
        
        let isSetNameUnique = user.cardsets.every((cardSet) => {
            return cardSet.setName !== req.body.setName
        })

        if (isSetNameUnique) {

            CardSets.create(req.body)

            .then(cardSet => {
                console.log("cardSet after CardSets.create: ", cardSet)
                let setId = cardSet.setName.toLowerCase().replace(" ", "-")

                cardSet.setId = setId
                cardSet.save()
                //upsert - if set to true and no record matched to the query, replacement object is inserted as a new record.

                .then(newCardSet => {
                    user.cardsets.push(newCardSet)
                    user.save()
                    console.log("user after user.save(): ", user)
                })
            })

            res.json(user)

        } else {
            res.json("Set Name must be unique")
        }
    }).catch(err => console.log(err))

})

.put((req, res) => {
    res.send(`PUT not supported on this route`)
})

.delete(auth.verifyUser, (req, res) => {
    Users.findById(req.user._id)
    .populate('cardsets')
    .then(user => {
        if (user.cardsets.length > 0){
            for (let i = user.cardsets.length - 1; i >= 0 ; i--){
                CardSets.findByIdAndRemove(user.cardsets[i]._id)
                user.cardsets.pop()
                user.save()
            }
            
            res.send("Deleted Successfully")
        }
        else {
            res.send("No sets found to delete")
        }
    })
    .catch(err => console.log(err))
})

// /:username/sets
setRouter.route('/:setId')

.get(auth.verifyUser, (req, res) => {
    Users.findById(req.user._id)
    .populate({
        path: 'cardsets',
        model: CardSets,
        populate: {
            path: 'cards',
            model: Cards
        }
    })

    .then(user => {

        let requestedSet = user.cardsets.filter(set => set.setId === req.params.setId)

        if (requestedSet.length > 0) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json");
            res.json(requestedSet)
        }

        else {
            res.send(`The set with setId: '${req.params.setId}' does not exist`)
        }

    
    })
    .catch(err => console.log(err))
})

.post(auth.verifyUser, (req, res) => {
    res.send(`POST not supported on this route`)
})

.put(auth.verifyUser, (req, res) => {
    // only setName can be updated here
    Users.findById(req.user._id)
    .populate('cardsets')

    .then(user => {
        let newSetId = req.body.setName.toLowerCase().replace(" ", "-")
        for (let i = 0; i < user.cardsets.length; i++){


            if (user.cardsets[i].setId === req.params.setId){


                CardSets.findByIdAndUpdate(user.cardsets[i]._id, {
                    $set: {setName: req.body.setName, setId: newSetId}
                }, {new: true})

                .then(newCardSet => res.json(newCardSet)).catch(err => console.log(err))
                break
            }
        }
    })
    
    .catch(err => console.log(err))
})

.delete(auth.verifyUser, (req, res) => {
    Users.findById(req.user._id)
    .populate('cardsets')
    .then(user => {
        for (let i = 0; i < user.cardsets.length; i++){
            if (user.cardsets[i].setId === req.params.setId){
                console.log("inside delete: ", user.cardsets[i])
                CardSets.findByIdAndRemove(user.cardsets[i]._id)
                .then(resp => console.log(resp))
                break
            }
        }
        res.json(`Set with id: '${req.params.setId}' deleted`)
    })
    .catch(err => console.log(err))
})

module.exports = setRouter