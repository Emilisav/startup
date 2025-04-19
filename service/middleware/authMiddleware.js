const express = require("express");

module.exports = (db, authCookieName) => {
  const router = express.Router();

  router.use(async (req, res, next) => {
    const authToken = req.cookies[authCookieName];
    const user = await db.getUserByToken(authToken);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ msg: "Unauthorized" });
    }
  });

  return router;
};
