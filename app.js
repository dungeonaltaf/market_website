"use strict";
const express = require('express');
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
const User = require('./models/user');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
mongoose.connect("mongodb+srv://altaf_hussain:mZMmOXzWQq0jhBrQ@cluster0.u1tdy.mongodb.net/node-angular?retryWrites=true&w=majority").then(()=> {
  console.log("Mongo db is connected!");
}).catch(() => {
  console.log("connection failed!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("images")));
app.use("/",express.static(path.join(__dirname,"angular")))
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With, Content-Type, Accept, multipart/form-data, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, PUT, PATCH, GET, OPTIONS");
  next();
});



app.use("/api/posts",postsRoutes);
app.use("/api/user", userRoutes);
// app.use((req,res,next) =>{
//   return res.status(200).json({
//     message: "altaf we made it"
//   });
// })
module.exports = app;
