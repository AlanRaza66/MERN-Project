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
    { _id: req.params.id },
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
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown :" + req.params.id);
  try {
    PostModel.remove({
      _id: req.params.id,
    }).exec();
    return res.status(200).json({ message: "Post successfully deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.likePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id))
    return res.status(400).send("ID unknown :" + req.params.id);

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) res.status(400).send(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.status(200).json(docs);
        else res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id))
    return res.status(400).send("ID unknown :" + req.params.id);
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) res.status(400).send(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.status(200).json(docs);
        else res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).json(err);
  }
};
