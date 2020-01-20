const express       = require('express');
const router        = new express.Router()
const {ObjectID}    = require('mongodb')
const multer        = require('multer');
const User          = require('../models/user')

router.post('/signup', async (req,res) => {
  //console.log(req.body);return
  const user = new User(req.body);
  try{
      const token = await user.newAuthToken()
      res.status(201).send({
        message:"User stored",
        user:user,
        token:token
      })
  }catch(e){
      res.status(400).send(e)
  }
})

router.post('/login', async (req, res) => {
  try {
      const user  = await User.checkValidCredentials(req.body.email, req.body.password)
      const token = await user.newAuthToken()
      //console.log(token);return;
      res.send({
        message:"User Logged In!",
        user:user,
        token:token
      })
  } catch (error) {
      res.status(400).send({message: 'Please enter correct user id and password'})
  }
})


module.exports = router;
