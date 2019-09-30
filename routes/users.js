const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.route('/').get((req,res)=>{
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req,res)=>{
  const username  = req.body.username;
  const email = req.body.email;
  const password_digest = bcrypt.hashSync(req.body.password, 10)

  const newUser = new User({username, email, password_digest});

  newUser.save()
    .then(()=> res.json({
      msg: 'User added!',
      success: true
  }))
    .catch(err => res.status(200).json({
      msg: `Error ${err}`,
      error: err,
      success: false
    }))
});

module.exports = router;