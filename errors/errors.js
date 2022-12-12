const invalidPathErrorHandler = (req, res) => {
    res.status(404).send({msg: "Path Not Found"})
};

const handle500s = (err, req, res) => {
    console.log(err, "500 Internal Server Error")
    res.status(500).send({msg: "Internal Server Error"})
}


module.exports = { invalidPathErrorHandler, handle500s };
