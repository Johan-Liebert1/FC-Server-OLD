const express     = require('express'),
      Cards       = require("../models/Cards"),
      CardSets    = require('../models/CardSets'),
      bodyParser  = require('body-parser'),
      cardsRouter = express.Router()

cardsRouter.use(bodyParser.json())


// /sets/:setId/cards

cardsRouter.route('/:setId/cards')

.get((req, res) => {
    CardSets.find({setId: req.params.setId}).populate('cards')
    .then(set => {
        if (set !== null){
            res.statusCode = 200
            res.setHeader("Content-Type", 'application/json')
            //set is an array containing only one set
            res.json(set[0].cards)
        }
        else 
            res.send(`Set with id: '${req.params.setId}' does not exist`)
    })
    .catch(err => console.log(err))
})

.post((req, res) => {
    CardSets.findOne({setId: req.params.setId})

    .then(cardSet => {
        if (cardSet !== null){
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

.delete((req, res) => {
    // CardSets.findOne({setId: req.params.setId})
    // .then(set => {
    //     if (set !== null){
    //         for (var i = set.cards.length - 1; i >= 0 ; i--){

    //             set.cards[i].remove() // probably an error will occur
                
    //         }
    //         res.json(set)
    //     }else
    //         res.send(`Set with id: '${req.params.setId}' does not exist`)
    // }).catch(err => console.log(err))
    CardSets.updateOne({setId: req.params.setId}, {$pull: {}})
    .then(resp => res.json(resp))
})


module.exports = cardsRouter

