const logger = require("./logger.js");

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "SequelizeValidationError") {
    const errorMessage = error.errors.map((error) => error.message);
    return res.status(400).json({ ...errorMessage });
  }

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.name });
  }

  next(error);
};

module.exports = { errorHandler };
