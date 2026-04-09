// used as a child router for usersRouter(./users.js)
const router = require("express").Router({ mergeParams: true });
const { BlogUser } = require("../models/index.js");
const {
  errorHandler,
  tokenExtractor,
  isAdmin,
} = require("../util/middleware.js");

router.put("/", tokenExtractor, isAdmin, async (req, res, next) => {
  try {
    const user = await BlogUser.unscoped().findOne({
      where: { username: req.params.username },
    });

    if (!user) {
      return res.status(404).end();
    }

    if (user.admin) {
      return res.status(401).json({ error: "you cannot disable an admin" });
    }

    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
