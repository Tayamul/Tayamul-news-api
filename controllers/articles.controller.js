const {
  selectArticles,
  selectArticlesById,
  selectCommentsByArticles,
  insertComments,
  updateArticles,
  insertArticles,
  dropArticles,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  const limit = req.query.limit;
  const p = req.query.p;

  selectArticles(topic, sort_by, order, limit, p)
    .then((result) => {
      res.status(200).send(result);
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
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

const patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticles(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

const postArticles = (req, res, next) => {
  insertArticles(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};

const deleteArticles = (req, res, next) => {
  const { article_id } = req.params;

  dropArticles(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

module.exports = {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  postComments,
  patchArticlesById,
  postArticles,
  deleteArticles,
};
