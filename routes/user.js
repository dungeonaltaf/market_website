const express = require('express');
const User =  require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var jwt_Secret;

router.post("/signup", (req,res,next)=>{
 
  bcrypt.hash(req.body.password,10).then(hash=>{

    const user = new User({
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      firstName: req.body.firstName,
      secondName: req.body.secondName
    });
    user.save().then(result =>{
      res.status(201).json({
        message: "User created!",
        result : result
      });
    }).catch(err => {
      res.status(500).json({
        message: "Invalid Authentication credentials!"
      })
    })
  });

});


// if there is wrong login info this fails!!
router.post("/login",(req,res,next)=>{
  let fetchedUser;
  // console.log("email:"+req.body.email);
  User.findOne({email: req.body.email}).then(user =>{
    if(!user){
      // console.log("User not found!")
      return res.status(401).json({
        message: 'Incorrect Email!'
      });
    }
    else{
      // console.log("found user!!!");
      fetchedUser = user;
      return bcrypt.compare(req.body.password,user.password);
    }
  }).then(result =>{
    if (!result){
      // console.log("password didn't matched!")
     return  res.status(401).json({
        message: 'Password Incorrect'
      });
    }
    // console.log("somehow the error flows to this section!!!");
    if (fetchedUser){
      const token = jwt.sign({email: fetchedUser.email,
        userId: fetchedUser._id,
        firstName: fetchedUser.firstName,
        secondName:fetchedUser.secondName,
        phone:fetchedUser.phone},
        'secret_this_should_be_longer',{expiresIn:"1h"});
      return res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    }
    }).catch(err =>{
      // console.log("error is:"+err);
      return res.status(401).json({
        message: 'Authorization Failed! Invalid Credentials',
      });

    });

})






module.exports =  router;