const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  postComments,
  patchArticlesById,
} = require("./controllers/articles.controller");
const {
  invalidPathErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  handle500s,
} = require("./errors/errors");
const endpoints = require("./endpoints.json")

const { getUsers } = require("./controllers/users.controller");

const { deleteComments } = require("./controllers/comments.controller");

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getArticlesCommentsById);
app.post("/api/articles/:article_id/comments", postComments);
app.patch("/api/articles/:article_id", patchArticlesById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComments);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.all("*", invalidPathErrorHandler);
app.use(handle500s);

module.exports = { app };
