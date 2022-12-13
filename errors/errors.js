const invalidPathErrorHandler = (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
};

const psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

const customErrorHandler = (err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handle500s = (err, req, res) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
  invalidPathErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  handle500s,
};
