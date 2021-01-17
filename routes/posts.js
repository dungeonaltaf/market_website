const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const multer = require('multer');

const check_auth = require("../middleware/check-auth");

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

router.get("",(req,res,next) => {
  console.log(req.query);
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  console.log("pageSize:"+pageSize);
  console.log("currentPage:"+(currentPage-1));
  let fetchedDocuments;
  const postQuery = Post.find();
  if (pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage-1)).limit(pageSize);
  }
  postQuery.
  then(documents=>{
    fetchedDocuments = documents;
    return Post.count();
  }).
  then(count=>{
      res.status(200).json({
        message: "This is a response successful message",
        posts: fetchedDocuments,
        maxPosts: count
      });
    });
  
});




router.get("/user",
check_auth,
(req,res,next) => {
  console.log(req.query);
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  console.log("pageSize:"+pageSize);
  console.log("currentPage:"+(currentPage-1));
  let fetchedDocuments;
  console.log("user id is:"+req.userData.userId);
  const postQuery = Post.find({'author.id':req.userData.userId});
  if (pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage-1)).limit(pageSize);
  }
  postQuery.
  then(documents=>{
    fetchedDocuments = documents;
    return Post.count();
  }).
  then(count=>{
      res.status(200).json({
        message: "This is a response successful message",
        posts: fetchedDocuments,
        maxPosts: count
      });
    });
  
});

router.post("",
  check_auth,
  multer({ storage: storage }).single("images"),
  (req,res,next)=> {

  const url = req.protocol + '://' + req.get("host");
  console.log("+++++++user data+++++++++"+req.userData.user_id);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    imagePath: url + "/images/" + req.file.filename,
    author: {id: req.userData.userId,
      firstName: req.userData.firstName,
      secondName: req.userData.secondName,
      phone: req.userData.phone
    }

  });
  post.save().then((savedPost)=>{
    console.log(post);
    return res.status(201).json({
    message: "Post added successfully!",
    post:{
      id: savedPost._id,
      title: savedPost.title,
      content: savedPost.content,
      imagePath: savedPost.imagePath,
      author: {id: req.userData.userId,
        firstName: req.userData.firstName,
        secondName: req.userData.secondName,
        phone: req.userData.phone
      }
    }

  });
  });
});

router.put("/:id",
  check_auth,
  multer({ storage: storage }).single("images"),
  (req,res,next)=>{
  let imagePath = req.body.imagePath;
  
  
  if (req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }


  console.log("image_path:"+imagePath);
  console.log("title:"+req.body.title);
  const post ={
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    imagePath: imagePath
  };
  console.log("performing edit");
  console.log(req.params.id);
  console.log("+++++++++++++post+++++++++++++++++++:"+post);
  Post.updateOne({_id: req.params.id},{$set:{
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    imagePath: imagePath
  }}).then(result => {
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

router.delete("/:id",
check_auth,
(req,res,next)=>{
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
router.post("/comment",
check_auth,
(req,res,next)=>{
  let id = req.body.id;

  Post.findById(id).then(post=>{
    if (!post){
      console.log("couldn't find the post!")
      res.status(404).json({message:'post not found to comment!'});
    }
    let comment_content = req.body.comment;
    let author = req.userData.firstName;
    

    return Post.update({_id: id},
      {$push: {
        comments:{
            comment: comment_content,
            commentator: author
          }
        }
      });
  }).then(updatdPost => {
    console.log(updatdPost);
  })
});


module.exports = router;
