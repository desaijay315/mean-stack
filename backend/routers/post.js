const express       = require('express');
const router        = new express.Router()
const Post          = require('../models/post')
const {ObjectID}    = require('mongodb')
const multer        = require('multer');
const auth          = require('../middleware/auth')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime Type");
    if(isValid){
      error = null;
    }
    cb(error,"backend/images")
  },
  filename: (req, file, cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext  = MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() + '.' + ext);
  }
})

router.get("/", auth, async(req, res, next) => {
  const pageSize = parseInt(req.query.pageSize);
  const currentPage = parseInt(req.query.page);
  //const postQuery = await Post.find({})
  let postQuery;
  let postCount;
  if(pageSize && currentPage){
    postQuery = await Post.find().skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }else{
    postQuery = await Post.find();
  }
  postCount  = await Post.countDocuments()

  res.status(200).json({
    message: "Posts Fetched Successfully!",
    posts: postQuery,
    maxPosts: postCount
  });
});

router.get("/:id", async(req, res, next) => {
  const _id = req.params.id;
  const post = await Post.findOne({ _id })

  if(post){
    res.status(200).json({
      message: "Post Fetched Successfully!",
      post: post
    });
  }else{
    res.status(200).json({
      message: "Post Fetched Failed!"
    });
  }

});


router.post("/",auth, multer({storage}).single("image"),async (req, res, next) => {
   const url = req.protocol + '://' + req.get("host")
   const post =  new Post({
    ...req.body,
    imagePath: url + "/images/" + req.file.filename
  })
  try {
    await post.save();
    res.status(201).send({
      message: "Posts Added Successfully!",
      post: post,
      postId: post._id
   });
  } catch (error) {
    res.status(400).send({
      message: "Failed to Fetch the post successfully!"
   });
  }
});

router.delete('/:id', auth,async (req,res) => {
  const _id = req.params.id
  if (!ObjectID.isValid(_id)) {
      return res.status(404).send();
  }
  try {
      const deletepost = await Post.findOneAndDelete({_id:_id})
      if (!deletepost) {
          return res.status(404).send();
      }
      res.status(200).json({
        message: "Post Deleted successfully!"
     });
  } catch (error) {
      res.status(500).send()
  }
})

router.patch('/:id', auth, multer({storage}).single("image"), async (req, res) => {
  const _id = req.params.id
  //console.log(_id);
 // console.log(req.body);
  let imagePath = req.body.imagePath;
 if(req.file){
  const url = req.protocol + '://' + req.get("host")
  imagePath = url + "/images/" + req.file.filename
 }
  req.body.imagePath = imagePath

  delete req.body.id;
  const updates = Object.keys(req.body);
  //console.log(req.body); return;

  const allowedUpdates = ["title", "content", "imagePath"]
  const isValidOperation  = updates.every((update) => allowedUpdates.includes(update))
  //console.log(isValidOperation); return;
  if(!isValidOperation){
      res.status(400).send({error:'Invalid updates'})
  }
  if (!ObjectID.isValid(_id)) {
      res.status(404).send();
  }
  try {
      const post = await Post.findOne({ _id })

     if(!post){
      res.status(404).send();
     }

     updates.forEach((update) => post[update] = req.body[update])
     await post.save()

     res.status(200).json(
       {
         message: "Post Succesfully updated",
         post: post
    });
  } catch (error) {
      res.status(400).send();
  }
})

/*
router.get('/', async (req,res) => {
  //const _ispublished = req.query.published;
  const match = {}
  const sort  = {}

  if(req.query.published){
      match.published = req.query.published === 'true'
  }

  if(req.query.sortBy && req.query.OrderBy){
      sort[req.query.sortBy]   = req.query.OrderBy === 'desc' ? -1 : 1
  }

  try {
      await req.user.populate({
          path:'posts',
          match,
          options:{
              limit: parseInt(req.query.limit),
              skip: parseInt(req.query.skip),
              sort
          }
      }).execPopulate()
      res.send(req.user.posts)
  } catch (error) {
      res.status(500).send()
  }
})


router.get('match', async (req,res) => {
  //const _ispublished = req.query.published;
  const match = {}
  const sort  = {}
  const pageSize = parseInt(req.query.pageSize);
  const currentPage = parseInt(req.query.currentPage);

  console.log(pageSize);
      console.log(currentPage);return;


  if(req.query.published){
      match.published = req.query.published === 'true'
  }

  if(req.query.sortBy && req.query.OrderBy){
      sort[req.query.sortBy]   = req.query.OrderBy === 'desc' ? -1 : 1
  }

  try {

    if(pageSize && currentPage){

      posts = await Post.populate({
        path:'/match',
        match,
        options:{
            limit: parseInt(pageSize * (currentPage - 1)),
            skip: parseInt(pageSize),
            sort
        }
      }).execPopulate()
      res.send(posts)
    }
  } catch (error) {
      res.status(500).send()
  }
})
*/

module.exports = router;
