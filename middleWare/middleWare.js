const notFound = () => (req, res, next) => {
  const err = new Error(`not found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};

const errorHandler = () => (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  if (err)
    res.json({
      msg: err.message,
      stack: process.env.NODE_ENV === "production" ? "" : err.stack
    });
};

module.exports = {
  notFound,
  errorHandler
};
