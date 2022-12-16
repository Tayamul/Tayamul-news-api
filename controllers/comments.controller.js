const { dropComments } = require("../models/comments.model");

const deleteComments = (req, res, next) => {
  const { comment_id } = req.params;

  dropComments(comment_id).then(() => {
    res.status(204).send();
  }).catch(err => next(err))
};

module.exports = { deleteComments };
