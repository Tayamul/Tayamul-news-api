const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
};

const addTopics = (newTopic) => {
  const { slug, description } = newTopic;

  if(!isNaN(slug) || !slug || !isNaN(description) || !description) {
    return Promise.reject({status:400, msg: "Bad Request"})
  }

  const queryString = `
  INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *;`

  return db.query(queryString, [slug, description]).then(({rows}) => rows[0])
}

module.exports = { selectTopics, addTopics };
