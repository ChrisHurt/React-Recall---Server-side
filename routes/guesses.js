const router = require('express').Router();
let User = require('../models/user.model')
let Guess = require('../models/guess.model');
let GuessSession = require('../models/guesssession.model');
let DataCollection = require('../models/datacollection.model');
let DataPoint = require('../models/datapoint.model');

// View all Guess Sessions
router.route('/').post((req,res)=>{
  if(!req.body.user_id){
    res.status(400).json('Action not allowed. Invalid user.')
  } 
  GuessSession.find()
    .then(guessSessions => res.json(guessSessions))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// Validate Guess Session
router.route('/:session_id/isvalid').post((req,res)=>{
  if(!req.body.user_id){
    res.status(400).json('Action not allowed. Invalid user.')
  } 
  GuessSession.findById(req.params.session_id)
    .then(guessSession => {
      if(guessSession != undefined && guessSession.user != undefined){
        res.status(200).json({
          guessSessionIsValid: true
        })
      } else {
        res.status(200).json({
          guessSessionIsValid: false
        })
      }
    })
    .catch(err => res.status(200).json({
      guessSessionIsValid: false
    }));
});

// View all Guess Sessions
router.route('/').post((req,res)=>{
  if(!req.body.user_id){
    res.status(400).json('Action not allowed. Invalid user.')
  } 
  GuessSession.find()
    .then(guessSessions => res.json(guessSessions))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// Return Recent Results
router.route('/recent-results').post((req,res)=>{
  if(!req.body.user_id){
    res.status(400).json('Action not allowed. Invalid user.')
  } 
  GuessSession.find({user: req.body.user_id})
    .then(guessSessions => {
        console.log()
        console.log('guessSessions')
        console.log(guessSessions)
        console.log()

      // guessSessions.map(guessSession=> guessSession.updatedAt)
      // guessSession.sort({updatedAt: 'desc'})

        res.status(200).json({
          msg: guessSession.sort({updatedAt: 'desc'})
        })
    })
    .catch(err => res.status(200).json({
      guessSessionIsValid: false
    }));
});

// View Guess Session by id
router.route('/:id').get((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  }
  GuessSession.findById(req.params.id)
    .then(guessSession => res.json(guessSession))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

// Add a Guess Session to a known collection id and user
router.route('/:collection_id/add').post((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  }
  const user_id = req.body.user_id
  const data_collection_id = req.params.collection_id

  const newGuessSession = new GuessSession({ user: user_id, dataCollection: data_collection_id });

  newGuessSession.save()
    .then(()=> {
      DataCollection.findById(req.params.collection_id)
        .then((dataCollection)=>{
          User.findById(user_id)
            .then((user)=>{
              user.guessSessions = [...user.guessSessions,newGuessSession.id]
              user.save().then(()=>{
                dataCollection.guessSessions = [...dataCollection.guessSessions,newGuessSession.id]
                dataCollection.save().then(()=>res.json({msg: `Guess Session for datacollection '${dataCollection.collectionName}' and user '${user_id}' added!`, session_id: newGuessSession.id}))
              })
            })
        })
    })
    .catch(err => res.status(400).json(`Error ${err}`))
});

// View all Guesses by Guess Session id
router.route('/:guess_session_id/guesses').post((req,res)=>{
  if(!req.body.user_id){
    res.status(400).json('Action not allowed. Invalid user.')
  }

  GuessSession.findById(req.params.guess_session_id).then((guessSession)=>{
    Guess.find({guessSession: guessSession})
      .then(guesses => res.json({guesses}))
      .catch(err => res.status(400).json(`Error: ${err}`));
    })
});

// View all guess sessions belonging to a user and data collection
router.route('/data-collection/:collection_id').post((req,res)=>{
  if(!req.body.user_id){
      res.status(404).json('Action not allowed. Invalid user.')
  } else {

    GuessSession.find({dataCollection: req.params.collection_id, user: req.body.user_id}).then((guessSessions)=>{
      // res.json(guessSessions)

      DataCollection.findById(req.params.collection_id).then((dataCollection)=>{
        // Find if there is an incomplete session
        // If guess > datapoints
        let filteredguessSessions = guessSessions.filter((guessSessions)=>{
          console.log('guesses length')
          console.log(guessSessions.guesses.length)
          console.log('Data Length')
          console.log(dataCollection.dataPoints.length)
          return (guessSessions.guesses.length < dataCollection.dataPoints.length)
        })
        
        res.json({
          guessSessions: (filteredguessSessions.length > 0) ? (filteredguessSessions[0]): (false)
        })

        // res.json({
        //   guesses: dataCollection.dataPoints.length,
        //   dataPoints: dataCollection.dataPoints.length
        // })
      })


    })
  }
});

// View a guess by its' ID
router.route('/guesses/:id').get((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  }
  Guess.findById(req.params.id)
    .then(guess => res.json(guess))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

// Add a guess to a guess session by guess session id
router.route('/:guess_session_id/:datapoint_id/add').post((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  }
  const remembered  = req.body.remembered;
  const guess_session_id = req.params.guess_session_id
  const datapoint_id = req.params.datapoint_id
  const newGuess = new Guess({remembered, guessSession: guess_session_id, dataPoint: datapoint_id});

  newGuess.save().then(()=>{
    GuessSession.findById(guess_session_id).then(
      (guessSession)=>{
        guessSession.guesses = [...guessSession.guesses,newGuess._id];
        guessSession.save().then(()=> {
          DataPoint.findById(datapoint_id).then((datapoint)=>{
            datapoint.guesses = [...datapoint.guesses,newGuess._id]
            datapoint.save().then(()=>res.json(`${(remembered === '1')?('Correct'):('Incorrect')} Guess added to guess_session_id: '${guess_session_id}' and correlates to datapoint_id: '${datapoint_id}'`))
          })
        })
      })
  })
  .catch(err => res.status(400).json(`Error ${err}`))

});
module.exports = router;