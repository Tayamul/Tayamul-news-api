const db = require("../db/connection");

const selectUsers = () => {
  const queryString = `
    SELECT * FROM users;`;

  return db.query(queryString).then(({ rows }) => rows);
};

const selectUsersByUsername = (username) => {
  if (!isNaN(username)){
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `
  SELECT * FROM users WHERE username = $1`;

  return db.query(queryString, [username]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found In The Database" });
    }
    return rows[0];
  });
};

module.exports = { selectUsers, selectUsersByUsername };
