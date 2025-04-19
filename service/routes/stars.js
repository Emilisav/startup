const express = require("express");

module.exports = (db, proxy) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const questions = await db.incStar(req.body.question);
    proxy.broadcast({ type: "questions_updated" });
    res.send(questions);
  });

  router.delete("/", async (req, res) => {
    const questions = await db.decStar(req.body.question);
    res.send(questions);
  });

  return router;
};
