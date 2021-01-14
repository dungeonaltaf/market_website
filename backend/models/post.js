const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

  title: {type: String, required: true},
  content: {type: String, required: true},
  comments:[{
    comment: {type:String},
    commentator:{type: String}
  }]
});

module.exports = mongoose.model('Post',postSchema)
