const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*")
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader('Access-Control-Allow-Methods', "GET,POST,PATCH,DELETE,OPTIONS")
  next();
})

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "1",
      title: "First post",
      content: "first post"
    },
    {
      id: "2",
      title: "second post",
      content: "second post"
    },
    {
      id: "3",
      title: "third post",
      content: "third post"
    }
  ];
  res.status(200).json({
    message: "Posts Fetched Successfully!",
    posts: posts
  });
});


app.post("/api/posts", (req, res, next) => {
 const post = req.body
 console.log(post)
 res.status(200).json({
    message: "Posts Fetched Successfully!",
    posts: post
 });
});


module.exports = app;
