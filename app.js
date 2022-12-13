const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller")
const { invalidPathErrorHandler, handle500s } = require("./errors/errors");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.all('*', invalidPathErrorHandler);
app.use(handle500s);

module.exports = {app};