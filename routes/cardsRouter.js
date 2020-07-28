const express     = require('express'),
      Cards       = require("../models/Cards"),
      CardSets    = require('../models/CardSets'),
      Users       = require('../models/Users'),
      bodyParser  = require('body-parser'),
      cardsRouter = express.Router(),
      auth        = require('../auth')

cardsRouter.use(bodyParser.json())


// /sets/:setId/cards

cardsRouter.route('/:setId/cards')

.get(auth.verifyUser, (req, res) => {
    // populating two levels deep
    Users.findById({_id: req.user._id})
    .populate({
        path: 'cardsets',
        model: CardSets,
        populate: {
            path: 'cards',
            model: Cards
        }
    })
    //have to send only the cards data and not the entire user data

    .then(user => {
        for (let i = 0; i < user.cardsets.length; i++){
            if (user.cardsets[i].setId === req.params.setId){
                console.log(user.cardsets[i].cards)
                res.json(user.cardsets[i].cards)
                break
            }
        }
    })
    .catch(err => console.log(err))
})

.post(auth.verifyUser, (req, res) => {
    Users.findById(req.user._id)
    .then(user => {

        CardSets.findOne({setId: req.params.setId})

        .then(cardSet => {
            if (cardSet !== null && user.cardsets.includes(cardSet._id)){
                Cards.create(req.body)
                
                //assuming cards to be an arrary every time, even for 1 entry

                .then(cards => {
                    console.log(cards)
                    cardSet.cards.push(...cards)

                    cardSet.save()
                    // res.json(arr)

                }).catch(err => console.log(err))

                res.send('Posted Successfully')
            }

            else
                res.send(`Set with id: '${req.params.setId}' does not exist`)

        }).catch(err => err)
    })
})

.put((req, res) => {
    res.send("PUT not supported on this route")
})

.delete((req, res) => {
    // as deleting all the cards is equivalent to deleting the entire set, no need for this route to be active
    res.send("DELETE opereation not supported on this end point")
})

cardsRouter.route("/:setId/cards/:cardId")

.get((req, res) => {
    Cards.findById(req.params.cardId)
    .then(card => res.json(card))
    .catch(err => console.log(err))
})


.post((req, res) => {
    res.send("POST operation is not supported on this end point")
})

.put((req, res) => {
    // update a certain card using the card id. Can update question/answer or both
    // findByIdAndUpdate takes care of all the cases, ie. either question or answer or both being empty
    Cards.findByIdAndUpdate(req.params.cardId, {
        $set: req.body
    }, {new: true})

    .then(card => {
        res.json(`Card Updated to: ${card}`)
    })

    .catch(err => console.log(err))
})

module.exports = cardsRouter

