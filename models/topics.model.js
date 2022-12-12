const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
};

module.exports = { selectTopics };
