const express = require("express");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

module.exports = (db, setAuthCookie, authCookieName) => {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const user = await db.getUser(req.body.name);

    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        await db.updateUser(user);
        setAuthCookie(res, user.token);
        return res.send({ id: user._id });
      }
      return res.status(401).send({ msg: "Unauthorized" });
    } else {
      const user = await db.createUser(req.body.name, req.body.password);
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
    }
  });

  router.delete("/logout", async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await db.getUserByToken(token);
    if (user) {
      user.token = null;
      await db.updateUser(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  });

  return router;
};
