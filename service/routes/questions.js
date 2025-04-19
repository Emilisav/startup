const express = require("express");

module.exports = (db, proxy) => {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const questions = await db.getQuestions();
    res.send(questions);
  });

  router.post("/", async (req, res) => {
    const rawQuestion = req.body.question || req.body;
    const questionText =
      typeof rawQuestion === "string"
        ? rawQuestion.trim()
        : (rawQuestion.question || "").trim();

    if (!questionText) {
      return res.status(400).send({ msg: "Question cannot be empty" });
    }

    const questionObj = {
      question: questionText,
      stars: 0,
      date: new Date().toISOString(),
      userName: req.user?.name || "Guest",
    };

    const updatedQuestions = await updateQuestion(db, questionObj);

    proxy.broadcast({
      type: "new_question",
      question: questionObj,
    });

    res.send(updatedQuestions);
  });

  async function updateQuestion(db, newQuestion) {
    const existingQuestions = await db.getQuestions();
    const exists = existingQuestions.some(
      (q) => q.question === newQuestion.question
    );

    if (!exists) {
      await db.addQuestion(newQuestion);
      return await db.getQuestions();
    }
    return existingQuestions;
  }

  return router;
};
