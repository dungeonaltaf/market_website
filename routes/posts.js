const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
}


const storage = multer.diskStorage({

    destination: (req,file,cb)=>{
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid Mime Type");
      console.log("inside destination");
      console.log("is valid?"+isValid);
      console.log(file.mimetype);
      if (isValid){
        error = null;
      }
      cb(error,"images");
    },
    filename: (req,file,cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      console.log("insde filename!");
      cb(null, name+ '-' + Date.now()+ '.'+ext);

    }
});



router.post("",multer({ storage: storage }).single("images"),(req,res,next)=> {

  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then((savedPost)=>{
    console.log(post);
    return res.status(201).json({
    message: "Post added successfully!",
    post:{
      id: savedPost._id,
      title: savedPost.title,
      content: savedPost.content,
      imagePath: savedPost.imagePath
    }

  });
  });
});

router.put("/:id",(req,res,next)=>{
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

router.get("s",(req,res,next) => {
  Post.find().then(documents=>{
    console.log(documents);
    return res.status(200).json({
      message: "This is a response successful message",
      posts: documents
    });
  });
});

router.get("/:id",(req,res,next) => {
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

router.delete("/:id",(req,res,next)=>{
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
router.post("/:id/comment/",(req,res,next)=>{
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


module.exports = router;
