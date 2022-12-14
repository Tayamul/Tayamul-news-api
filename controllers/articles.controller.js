const {
  selectArticles,
  selectArticlesById,
  selectCommentsByArticles,
  insertComments,
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

const postComments = (req, res, next) => {
  const { article_id } = req.params;

  insertComments(req.body, article_id)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch((err) => next(err));
};

module.exports = {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  postComments,
};
