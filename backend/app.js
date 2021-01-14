"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
const User = require('./models/user');
const postsRoutes = require('./routes/posts');
mongoose.connect("mongodb+srv://altaf_hussain:mZMmOXzWQq0jhBrQ@cluster0.u1tdy.mongodb.net/node-angular?retryWrites=true&w=majority").then(()=> {
  console.log("Mongo db is connected!");
}).catch(() => {
  console.log("connection failed!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, PUT, PATCH, GET, OPTIONS");
  next();
});

app.post("/api/post",(req,res,next)=> {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((savedPost)=>{
    console.log(post);
    return res.status(201).json({
    message: "Post added successfully!",
    postId: savedPost._id
  });
  });
});


app.put("/api/post/:id",(req,res,next)=>{
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  console.log("performing edit");
  console.log(req.params.id);
  console.log("post:"+post);
  Post.updateOne({_id: req.params.id},post).then(result => {
    console.log(result);
    console.log("Post:");
    res.status(200).json(
      {message: 'Update successful!',
      postId: req.body.id
      });
  })
});

app.get("/api/posts",(req,res,next) => {
  Post.find().then(documents=>{
    console.log(documents);
    return res.status(200).json({
      message: "This is a response successful message",
      posts: documents
    });
  });
});

app.get("/api/post/:id",(req,res,next) => {
  console.log("Iam here!")
  Post.findById(req.params.id).then(document=>{
    if (document){
      console.log(document);
      return res.status(200).json(document);
    }
    else{
      console.log("couldn't find the document!")
      res.status(404).json({message:'post not found!'});

    }
  });
});

app.delete("/api/post/:id",(req,res,next)=>{
  var id = req.params.id
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    Post.deleteOne({
      _id: id
    }).then(result => {
      console.log(result);
      return res.status(200).json({
        message: "Post deleted!"
      });
    });
  }
  else{
    console.log("request for id"+id);
      return res.status(200).json({
        message: "Post didn't existed!"
      });
  }
});
app.post("/api/post/:id/comment/",(req,res,next)=>{
  var id = req.params.id
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    Post.findOne({},(err,post)=>{
      if (err){
        res.json({success:false,message:'Invalid post id'})
      }
      else{
        if(!post){
          res.json({success:false,message:'Post not found!'})
        }
        else{
          User.findOne({_id:req.body.user_id,},(err,user)=>{
            if(err){
              res.json({success:false,message: 'Invalid user id!'});
            }
            else{
              if (!user){
                res.json({success:false,message:'User not found'})
              }
              else{
                post.comments.push({
                  comment: req.body.comment,
                  commentator: user.username
                })
                post.save((err)=>{
                  if (err){
                  res.json({success:true,message:'Something went wrong'});
                  }
                  else{
                    res.json({success:true,message:'Comment Saved!'})
                  }
                });
              }
            }
          });
        }
      }
    });
  }
  else{
    console.log("request for id"+id);
    return res.status(200).json({
      message: "Post didn't existed!"
    });
  }
});

app.use("/api/post",postsRoutes);
module.exports = app;
