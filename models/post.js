const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

  title: {type: String, required: true},
  content: {type: String, required: true},
  price: {type: String, required: true},
  imagePath: {type: String, required: true},
  author: {id: {type: mongoose.Schema.Types.ObjectId,ref: "User", required: true},
            firstName:{type: String, ref: "User", required: true},
            secondName:{type: String, ref: "User", required: true},
            phone:{type: String, ref: "User", required: true}},
  comments:[{
    comment: {type:String},
    commentator:{type: String}
  }]
});

module.exports = mongoose.model('Post',postSchema)
