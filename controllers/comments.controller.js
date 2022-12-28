const { dropComments, updateComments } = require("../models/comments.model");

const deleteComments = (req, res, next) => {
  const { comment_id } = req.params;

  dropComments(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

const patchComments = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateComments(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => next(err));
};

module.exports = { deleteComments, patchComments };
