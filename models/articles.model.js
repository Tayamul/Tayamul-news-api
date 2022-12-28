const db = require("../db/connection");

const selectArticles = async (
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  if (topic) {
    const SQL = `SELECT * FROM topics WHERE slug = $1`;
    const { rowCount } = await db.query(SQL, [topic]);
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: `${topic} not found` });
    }
  }

  const validSortByQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const validOrderQueries = ["asc", "desc"];

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let topicValue = [];
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.body) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id `;

  if (topic !== undefined) {
    queryString += `WHERE articles.topic = $1 `;
    topicValue.push(topic);
  }

  queryString += `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, topicValue).then(({ rows }) => rows);
};

const selectArticlesById = (article_id) => {
  if (article_id < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `
  SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.body, articles.created_at, articles.votes, COUNT(comments.body) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;

  return db.query(queryString, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found In The Database" });
    }
    return rows[0];
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
};

const insertArticles = async (newArticle) => {
  const { author, title, body, topic } = newArticle;

  if(!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if(!isNaN(author) || !isNaN(topic) || !isNaN(body) || !isNaN(title)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const query1 = `
  SELECT * FROM articles
  WHERE author = $1;`;

  const result1 = await db.query(query1, [author]);
  if (result1.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found In The Database" });
  }

  const query2 = `
  SELECT * FROM articles
  WHERE topic = $1;`;

  const result2 = await db.query(query2, [topic]);
  if (result2.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found In The Database" });
  }

  const SQL = `
  INSERT INTO articles
    (author, title, body, topic)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *;
  `;
  return db
    .query(SQL, [author, title, body, topic])
    .then(() => {
      const queryString = `
    SELECT articles.author, articles.title, articles.body, articles.topic, articles.article_id, articles.votes, articles.created_at, COUNT(comments.body) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = 13
    GROUP BY articles.article_id;
    `;
      return db.query(queryString).then(({ rows }) => {
        return rows[0];
      });
    })
    .catch((err) => next(err));

  // const SQL = `
  // SELECT articles.author, articles.title, articles.body, articles.topic, articles.article_id, articles.votes, articles.created_at, COUNT(comments.body) AS comment_count
  // FROM articles
  // LEFT JOIN comments
  // ON articles.article_id = comments.article_id
  // GROUP BY articles.article_id;
  // `;
  // return db
  //   .query(SQL)
  //   .then((result) => {
  //     console.log(result,"RESULT")
  //     return result;
  //   })
  //   .then((result) => {
  //     const queryString = `
  //   INSERT INTO articles
  //   (author, title, body, topic)
  //   VALUES
  //   ($1, $2, $3, $4)
  //   RETURNING $5;
  //   `;
  //     return db
  //       .query(queryString, [author, title, body, topic, result])
  //       .then((answer) => {
  //         console.log(answer, "row, model");
  //         return answer;
  //       });
  //   });
};

module.exports = {
  selectArticles,
  selectArticlesById,
  selectCommentsByArticles,
  insertComments,
  updateArticles,
  insertArticles,
};
