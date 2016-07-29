'use strict';

const express = require('express');
const User = require('../models/user');

let Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});




let router = express.Router();
// let request = require('request');

//   users.js
//   /api/users
router.get('/profile', User.authMiddleware, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
});

router.get('/', (req, res) => {

  // NOT FOR PRODUCTION - TESTING ONLY
  User.find({}, (err, users) => {

    if(err) return res.status(400).send(err);
    res.send(users);
  });
});

router.post('/register', (req, res) => {
  // Register a new user

  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.post('/login', (req, res) => {
  // Authenticate a returning user

  User.authenticate(req.body, (err, user) => {
    // console.log('err:', err);
    console.log("req.body: ",req.body);
    if(err) return res.status(400).send(err);
    let token = user.generateToken();


    res.cookie('authtoken', token).send(user);
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('authtoken').send();
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.delete('/', (req, res)=>{
  User.remove({},(err)=>{
    res.status(err ? 400 : 200).send(err);

  });

  })

router.get('/searchYelp/:term/:location', (req, res) => {

  console.log('req.params.term: ',req.params.term);
  console.log('req.params.location: ',req.params.location);
  yelp.search({ term: req.params.term, location: req.params.location })
  .then(function (data) {
    console.log(data);
    res.send(data);
  })
  .catch(function (err) {
    console.error(err);
    res.status(400).send(err);
  });

})



router.put('/addYelp/:userId', (req, res) => {
  console.log('req.params.userId: ',req.params.userId);
  console.log("req.body: ", req.body.businessId);
  User.findById(req.params.userId, (err, user)=>{
    if(err || !user) return res.status(400).send(err || {error: 'user not found'});
    console.log("user: ", user);

    let yelp = {
      businessId : req.body.businessId
    }
    user.yelps.push(yelp);
    user.save((err, savedYelp)=>{
      res.status(err ? 400 : 200).send(err || savedYelp);
    })
  })
})

router.get('/searchBussiness/:id', (req, res) => {

  console.log('req.params.id: ',req.params.id);
  yelp.business(req.params.id)
    .then(respond => {
      console.log("respond: ", respond);
      res.send(respond);
    })
    .catch(err => {
      console.log("err: ", err);
      res.status(400).send(err);
    });


})


router.put('/deleteYelp/:userId/:businessId', (req, res) => {

  console.log('req.params.userId: ',req.params.userId);
  console.log('req.params.businessId: ',req.params.businessId);

  User.findByIdAndUpdate(req.params.userId, {
    $pull: {yelps: {
      businessId: req.params.businessId
    }}
  } ,(err, user)=>{
    if(err || !user) return res.status(400).send(err || {error: 'user not found'});

    user.save((err, savedYelp)=>{
      res.status(err ? 400 : 200).send(err || savedYelp);
    })
  })


})



module.exports = router;
