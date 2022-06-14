const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.status(200).send(docs);
    if (err) console.log("Error to get data: " + err);
  });
};
module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);
  const updateRecord = {
    message: req.body.message,
  };

  PostModel.findOneAndUpdate(
    req.params.id,
    {
      $set: updateRecord,
    },
    {
      new: true,
    },
    (err, docs) => {
      if (!err) res.status(200).send(docs);
      if (err) console.log("Update error: " + err);
    }
  );
};
module.exports.deletePost = (req, res) => {};