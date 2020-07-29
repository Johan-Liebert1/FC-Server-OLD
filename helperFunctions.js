exports.set_associated_with_user = (userCardSetIds, allCardSetsFound) => {
    console.log("Inside helper func: ", userCardSetIds, allCardSetsFound)
    for (let i = 0; i < allCardSetsFound.length; i++){
        if (userCardSetIds.includes(allCardSetsFound[i]._id))
            return allCardSetsFound[i]
    }
}


// userCardSetsIds = [
//     5f1eee8f54c4922edc0b5733,
//     5f1fc1a95589813aacc6ca0b,
//     5f2110b9cc56ab49f8b8f98a
//   ]

//   [
//     allCardSetsFound[0] = {
//       cards: [
//       ],
//       _id: 5f210ed8733b193f589698c0,
//       setName: 'Pragyan Set 1',
//       __v: 1,
//       setId: 'pragyan-set-1'
//     },
//     {
//       cards: [],
//       _id: 5f2110b9cc56ab49f8b8f98a,
//       setName: 'Pragyan Set 1',
//       __v: 0,
//       setId: 'pragyan-set-1'
//     }
//   ]