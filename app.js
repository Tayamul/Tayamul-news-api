const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const { invalidPathErrorHandler, handle500s } = require("./errors/errors");

app.get("/api/topics", getTopics);


app.all('*', invalidPathErrorHandler);
app.use(handle500s);

module.exports = {app};