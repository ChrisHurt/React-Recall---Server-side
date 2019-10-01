const router = require('express').Router();
let User = require('../models/user.model');
let DataPoint = require('../models/datapoint.model');
let DataCollection = require('../models/datacollection.model');

let Guess = require('../models/guess.model');
let GuessSession = require('../models/guesssession.model');

router.route('/metrics/:id').post((req,res)=>{
    if(!req.body.user_id){
      res.status(404).json('Action not allowed. Invalid user.')
    } else {
      
      DataCollection.findById(req.params.id)
        .then(dataCollection => {
          GuessSession.find({dataCollection: dataCollection}).then(guessSessions=>{
            Guess.find({guessSession: { "$in": guessSessions.map(guessSession=>guessSession._id)}}).then(guesses=>{
              DataPoint.find({ guesses: { "$in": guesses.map(guess=>guess._id)} }).then(datapoints=> {
                dataPointRecollections = guesses.reduce((evaluatedDatapoints,guess)=>{
                  if(evaluatedDatapoints[guess.dataPoint] != null && evaluatedDatapoints[guess.dataPoint] != undefined ){
                    if(guess.remembered == 1){
                      evaluatedDatapoints[guess.dataPoint]['remembered'] += 1
                    } else {
                      evaluatedDatapoints[guess.dataPoint]['forgot'] += 1
                    }
                  } else {
                    if(guess.remembered == 1){
                      evaluatedDatapoints[guess.dataPoint] = {
                        remembered: 1,
                        forgot: 0
                      }
                    } else {
                      evaluatedDatapoints[guess.dataPoint] = {
                        remembered: 0,
                        forgot: 1
                      }
                    }
                  }
                  return evaluatedDatapoints
                },{})

                responseDatapoints = datapoints.map(dataPoint=>{

                  return {
                    memoryText: dataPoint.memoryText,
                    imageURL: dataPoint.imageUrl,
                    remembered: dataPointRecollections[dataPoint._id].remembered,
                    forgot: dataPointRecollections[dataPoint._id].forgot,
                    averageRecall: Math.round(100 * dataPointRecollections[dataPoint._id].remembered / (dataPointRecollections[dataPoint._id].remembered + dataPointRecollections[dataPoint._id].forgot))
                  }
                })

                let worstRecall = responseDatapoints.reduce((currentWorstRecall, currentDataPoint)=>{
                  if(currentDataPoint.averageRecall < currentWorstRecall.averageRecall){
                    return {memoryText: currentDataPoint.memoryText, averageRecall: currentDataPoint.averageRecall}
                  } else {
                    return {memoryText: currentWorstRecall.memoryText, averageRecall: currentWorstRecall.averageRecall}
                  }
                },{ memoryText: "", averageRecall: 100 })

                let bestRecall = responseDatapoints.reduce((currentWorstRecall, currentDataPoint)=>{
                  if(currentDataPoint.averageRecall > currentWorstRecall.averageRecall){
                    return {memoryText: currentDataPoint.memoryText, averageRecall: currentDataPoint.averageRecall}
                  } else {
                    return {memoryText: currentWorstRecall.memoryText, averageRecall: currentWorstRecall.averageRecall}
                  }
                },{ memoryText: "", averageRecall: 0 })

                let averageRecall = 0;
                if (responseDatapoints.length > 0){
                  averageRecall = Math.round(responseDatapoints.reduce((total, currentDataPoint)=>total + currentDataPoint.averageRecall,0) / responseDatapoints.length)
                }

                res.status(200).json({
                  datapoints: responseDatapoints,
                  worstRecall,
                  bestRecall,
                  averageRecall
                });
              })
            })
          })
        })
        .catch(err => res.status(400).json(`Error: ${err}`));
    }
})


// View all Data Collections by loggedin user
router.route('/').post((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  } else {
    DataCollection.find({user: req.body.user_id})
    .then(dataCollections => res.json(dataCollections))
    .catch(err => res.status(400).json(`Error: ${err}`));
  }
});

// Add a data collection
router.route('/add').post((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  } else {
    const collectionName  = req.body.collectionName;
    const user_id = req.body.user_id
    const newDataCollection = new DataCollection({collectionName, user: user_id});
  
    newDataCollection.save((err,res4)=>{
      console.log('err')
        console.log(err)
        console.log()
        console.log('res4')
        console.log(res4)
        console.log()
    })
      .then((res3,res2)=> {
        console.log('res')
        console.log(res3)
        console.log()
        console.log('res2')
        console.log(res2)
        console.log()
        User.findById(user_id).then((user)=>{
          user.dataCollections = [...user.dataCollections,newDataCollection._id]
          user.save().then(()=>res.json({
            msg: `Data Collection '${collectionName}' added to user: '${user.username}'`,
            collection_id: newDataCollection._id
          }))
        })
      })
      .catch(err => res.status(400).json(`Error ${err}`))
  }
});
// View data collection by id
router.route('/:id').post((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  } else {
    DataCollection.findById(req.params.id)
      .then(dataCollection => res.json(dataCollection))
      .catch(err => res.status(400).json(`Error: ${err}`))
  }
})

// View all Data Points by Collection id
router.route('/:collection_id/datapoints').post((req,res)=>{
  console.log('collection datapoints being accessed')
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  } else {
    DataCollection.findById(req.params.collection_id).then((dataCollection)=>{
      DataPoint.find({dataCollection: dataCollection})
      .then(dataPoints => res.json({
        dataPoints
      }))
      .catch(err => res.status(400).json(`Error: ${err}`));
    })
  }
});

// View data point by data point id
router.route('/datapoints/:id').get((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  } else {
    DataPoint.findById(req.params.id)
      .then(dataPoint => res.json(dataPoint))
      .catch(err => res.status(400).json(`Error: ${err}`))
  }
})

// Add a data point to a collection by collection id
router.route('/:collection_id/add').post((req,res)=>{
  if(!req.body.user_id){
    res.status(404).json('Action not allowed. Invalid user.')
  } else {
    const memoryText  = req.body.memoryText;
    const imageUrl = req.body.imageUrl;
    const dataCollection_id = req.params.collection_id 
    const newDataPoint = new DataPoint({memoryText, imageUrl, dataCollection: dataCollection_id});
  
    newDataPoint.save().then(()=>{
      DataCollection.findById(dataCollection_id).then(
        (dataCollection)=>{
          console.log(dataCollection)
          dataCollection.dataPoints = [...dataCollection.dataPoints,newDataPoint._id];
          dataCollection.save().then(()=> res.json(`Data Point with memory text '${memoryText}' added to data collection: '${dataCollection.collectionName}'`))
        })
    })
    .catch(err => res.status(400).json(`Error ${err}`))
  }

});
module.exports = router;