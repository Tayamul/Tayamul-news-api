const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  postComments,
} = require("./controllers/articles.controller");
const {
  invalidPathErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  handle500s,
} = require("./errors/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getArticlesCommentsById);

app.post("/api/articles/:article_id/comments", postComments);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.all("*", invalidPathErrorHandler);
app.use(handle500s);

module.exports = { app };
