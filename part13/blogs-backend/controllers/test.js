const router = require("express").Router();
const { errorHandler } = require("../util/middleware.js");

router.get("/", async (req, res) => {
  res.status(200).end();
});

router.use(errorHandler);

module.exports = router;
