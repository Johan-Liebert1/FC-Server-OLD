const express    = require("express"),
      CardSets   = require("../models/CardSets"),
      Users      = require('../models/Users')
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
    .then(user => {
        if (user.cardsets.length > 0){
            for (let i = user.cardsets.length - 1; i >= 0 ; i--){
                CardSets.findByIdAndRemove(user.cardsets[i])
                .then(set => set.save()).catch(err => console.log(err))
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