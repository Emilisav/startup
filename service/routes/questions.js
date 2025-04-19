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

    let check = await checkQuestion(questionText);

    if (!check.isValid) {
      return res.status(400).send({ msg: check.msg });
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

  async function checkQuestion(question) {
    try {
      let key = require("./key.json").key;

      response = await fetch(
        "https://degrawchatgpt.openai.azure.com/openai/deployments/degraw/chat/completions?api-version=2024-02-15-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": key,
          },
          // body: '{\n  "messages": [{"role":"system","content":"You are an AI assistant that helps people find information."}],\n  "max_tokens": 800,\n  "temperature": 0.7,\n  "frequency_penalty": 0,\n  "presence_penalty": 0,\n  "top_p": 0.95,\n  "stop": null\n}',
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                /*Assistant: The role that provides responses to system-instructed or user-prompted input.
Function: The role that provides function results for chat completions.
System: The role that instructs or sets the behavior of the assistant.
Tool: The role that represents extension tool activity within a chat completions operation.
User: The role that provides input for chat completions1. */
                content: question,
              },
            ],
            max_tokens: 800,
            temperature: 0.7,
            frequency_penalty: 0,
            presence_penalty: 0,
            top_p: 0.95,
            stop: null,
          }),
        }
      );

      response2 = (await response.json()).choices;

      const keyResponse = response2[0].message.content;

      // parse response for yes or no
      // if valid, return true
      // else return false and message
    } catch (error) {
      console.log(error);
    }
  }

  return router;
};
