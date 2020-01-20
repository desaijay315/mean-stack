const path = require('path')
const express = require("express");
const cors = require("cors");
require('./db/mongoose');
const app = express();

const PostRoutes = require('./routers/post')
const UserRoutes = require('./routers/user')
app.use(cors())
app.use(express.json())

app.use("/api/posts",PostRoutes)
app.use("/api/user",UserRoutes)
app.use("/images",express.static(path.join("backend/images")))

module.exports = app;
