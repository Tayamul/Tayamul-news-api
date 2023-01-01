const { selectTopics, addTopics } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

const postTopics = (req, res, next) => {
  addTopics(req.body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => next(err));
};

module.exports = { getTopics, postTopics };
