const express = require("express");
const llm = require("../LLM.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (!req.body?.question?.trim()) {
      return res.status(400).json({ error: "Empty question" });
    }
    const answer = await llm.respond({ question: req.body.question });
    res.json({ response: answer.answer });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
