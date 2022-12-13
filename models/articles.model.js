const db = require("../db/connection");

const selectArticles = () => {
  const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.body) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`;

  return db.query(queryString).then(({ rows }) => rows);
};

const selectArticlesById = (article_id) => {
  if (article_id < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `
  SELECT article_id, author, title, topic, body, created_at, votes FROM articles
  WHERE article_id = $1;`;

  return db.query(queryString, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found In The Database" });
    }
    return rows;
  });
};

module.exports = { selectArticles, selectArticlesById };
