const router = require("express").Router();
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("../util/middleware.js");
const { Session } = require("../models/index.js");

// for logout
router.delete("/", tokenExtractor, userExtractor, async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        blogUserId: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!session) {
      return res.status(400).json({ error: "session does not exist" });
    }

    await session.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
