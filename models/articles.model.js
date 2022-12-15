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

const selectCommentsByArticles = (article_id) => {
  if (article_id < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryString = `
  SELECT comment_id, votes, created_at, author, body FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;`;

  return db.query(queryString, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return db
        .query(
          `
      SELECT article_id FROM articles
      WHERE article_id = ${article_id}`
        )
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Not Found In The Database",
            });
          }
          return [];
        });
    }
    return rows;
  });
};


const insertComments = async (newComment, article_id) => {
  const { username, body } = newComment;

  if (!username || !body)
    return Promise.reject({ status: 400, msg: "Bad Request" });

  if (article_id < 1)
    return Promise.reject({ status: 400, msg: "Bad Request" });

  const SQL = `
  SELECT * FROM articles
  WHERE article_id = $1;`;

  const { rowCount } = await db.query(SQL, [article_id]);
  if (rowCount === 0)
    return Promise.reject({
      status: 404,
      msg: `Article ${article_id} Is Not In The Database`,
    });

  const SQL2 = `
  SELECT * FROM users
  WHERE username = $1;`;

  const result = await db.query(SQL2, [username]);
  if (result.rowCount === 0)
    return Promise.reject({ status: 404, msg: "Username Not Found" });

  const queryString = `
  INSERT INTO comments
  (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *;
  `;

  return db
    .query(queryString, [article_id, username, body])
    .then(({ rows }) => rows[0]);
};


const updateArticles = (article_id, incrementBy) => {
  if (incrementBy === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const queryString = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;

  return db
    .query(queryString, [incrementBy, article_id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found In The Database",
        });
      }
      return rows[0];
    });
    
module.exports = {
  selectArticles,
  selectArticlesById,
  selectCommentsByArticles,
  insertComments,
  updateArticles
};
