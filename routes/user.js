const express = require('express');
const User =  require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var jwt_Secret;

router.post("/signup", (req,res,next)=>{
  console.log("phone:"+req.body.phone);
  console.log("firstName:"+req.body.firstName);
  console.log("requested response is:"+req.body.email);
  console.log("requested password"+ req.body.password);
  bcrypt.hash(req.body.password,10).then(hash=>{
    console.log("hash has been create!!")

    const user = new User({
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      firstName: req.body.firstName,
      secondName: req.body.secondName
    });
    user.save().then(result =>{
      console.log("User was created!");
      res.status(201).json({
        message: "User created!",
        result : result
      });
    }).catch(err => {
      console.log("bhai dikkat hi dikkat he zindagi me"+err);
      res.status(500).json({
        error: err
      })
    })
  });

});

router.post("/login",(req,res,next)=>{
  let fetchedUser;
  console.log("email:"+req.body.email);
  User.findOne({email: req.body.email}).then(user =>{
    if(!user){
      console.log("User not found!")
      return res.status(401).json({
        message: 'Authorization Failed!',
        reason: "User not found!"
      });
    }
    console.log("found user!!!");
    fetchedUser = user;
    return bcrypt.compare(req.body.password,user.password);
  }).then(result =>{
    if (!result){
      console.log("password didn't matched!")
     return  res.status(401).json({
        message: 'Authorization Failed!',
        reason: "Password incorrect!"
      });
    }
    const token = jwt.sign({email: fetchedUser.email,
      userId: fetchedUser._id,
      firstName: fetchedUser.firstName,
      secondName:fetchedUser.secondName,
      phone:fetchedUser.phone},
      'secret_this_should_be_longer',{expiresIn:"1h"});
      res.status(200).json({
        token: token,
        expiresIn: 3600
      })

  }).catch(err =>{
    console.log("error is"+err);
    return res.status(401).json({
      message: 'Authorization Failed!',
      error: err
    });

  })
})






module.exports =  router;