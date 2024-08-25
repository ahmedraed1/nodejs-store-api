const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ msg: "Something went wrong" });
};
module.exports = errorHandlerMiddleware;
