const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  post_id: {type: String, required: true},
  user_id: {type: String, required: true},
  content: {type: String, required: true}
});

module.exports = mongoose.model('Comment',commentSchema)
