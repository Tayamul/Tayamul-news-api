const {
  selectArticles,
  selectArticlesById,
  selectCommentsByArticles,
  updateArticles,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticlesCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticles(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

const patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { incVote } = req.body;

  updateArticles(article_id, incVote)
    .then((votes) => {
      res.status(200).send({ votes });
    })
    .catch((err) => next(err));
};

module.exports = {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  patchArticlesById,
};
