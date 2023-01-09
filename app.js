const cors = require('cors');
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

const { getTopics, postTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  postComments,
  patchArticlesById,
  postArticles,
  deleteArticles
} = require("./controllers/articles.controller");
const {
  invalidPathErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  handle500s,
} = require("./errors/errors");
const endpoints = require("./endpoints.json");

const { getUsers, getUsersByUsername } = require("./controllers/users.controller");

const { deleteComments, patchComments } = require("./controllers/comments.controller");

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);
app.post("/api/topics", postTopics)

app.get("/api/articles", getArticles);
app.post("/api/articles", postArticles);

app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getArticlesCommentsById);
app.post("/api/articles/:article_id/comments", postComments);
app.patch("/api/articles/:article_id", patchArticlesById);
app.delete("/api/articles/:article_id", deleteArticles)

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUsersByUsername)

app.delete("/api/comments/:comment_id", deleteComments);
app.patch("/api/comments/:comment_id", patchComments)

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.all("*", invalidPathErrorHandler);
app.use(handle500s);

module.exports = { app };
