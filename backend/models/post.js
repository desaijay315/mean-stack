const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title:{
    type:String,
    unique:true,
    required: true,
    trim: true
  },
  content:{
    type: String,
    required:true,
    trim: true
  },
  imagePath: {
    type: String,
    required:true
  }
 },{
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post
