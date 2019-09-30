const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.route('/login').post((req,res)=>{
  User.find({ username: req.body.username},{username: 1, password_digest: 1})
  .then(
    (users) => {
      if(users.length > 1){
        res.status(400).json(`Non-unique name identified - contact your database administrator`)
      } else if (users[0] && bcrypt.compareSync(req.body.password,users[0].password_digest)){
        // sess.user_id = users[0]._id
        // sess.username = users[0].username

        // console.log()
        // console.log('session:')
        // console.log(sess)
        // console.log()

        res.status(200).json({
          msg: `User '${req.body.username}' Authenticated`,
          authenticated: true,
          // Temporary Solution, not secure
          user_id: users[0]._id,
          username: users[0].username
        })
        
      } else {
        res.status(400).json({
          msg: `Invalid username or password, not authenticated`,
          authenticated: false,
          user_id: '',
          username: ''
        })
      }
    }
  )
  .catch(err => res.status(400).json(`Error: ${err}`));
})

router.route('/logout').post((req,res)=>{
  // req.session.destroy(function(err){
  //   if(err){
  //       console.log(err);
  //   } else {
        res.status(200).json(`User logged out`)
//     }
// });
})

module.exports = router;