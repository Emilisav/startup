const express = require("express");

module.exports = (db, proxy) => {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const questions = await db.getQuestions();
    res.send(questions);
  });

  router.post("/", async (req, res) => {
    try {
      const rawQuestion = req.body.question || req.body;
      const questionText =
        typeof rawQuestion === "string"
          ? rawQuestion.trim()
          : (rawQuestion.question || "").trim();

      if (!questionText) {
        return res.status(400).send({ msg: "Question cannot be empty" });
      }

      const check = await checkQuestion(questionText);

      if (!check.isValid) {
        return res.status(400).send({ msg: check.msg.replace(/^No:\s*/, "") });
      }

      const questionObj = {
        question: questionText,
        stars: 0,
        date: new Date().toISOString(),
        userName: req.user?.name || req.body.user || "Guest",
      };

      const updatedQuestions = await updateQuestion(db, questionObj);

      proxy.broadcast?.({
        type: "new_question",
        question: questionObj,
      });

      res.send(updatedQuestions);
    } catch (err) {
      res.status(500).send({ msg: "Internal server error" });
    }
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
        "https://nddeg-m9oiap5m-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview",
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
                content:
                  "Your purpose is to verify whether the user's input is appropriate for inclusion in a database of social interaction questions. Check that the input is phrased as a question suitable for use in a social context (e.g., conversation starters, icebreakers, or general discussion). Ensure the question is safe for work and free from inappropriate, offensive, or sensitive content. Begin your response with Yes if the input is valid, or No if it is not, followed by a brief explanation. Example Output: Yes: This is a suitable and safe question for social interaction. No: This is not phrased as a question, or it contains inappropriate content.",
              },
              {
                role: "user",
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

      response2 = await response.json();

      const keyResponse = response2.choices[0].message.content;

      if (keyResponse.startsWith("Yes")) {
        return { isValid: true, msg: keyResponse };
      } else {
        return { isValid: false, msg: keyResponse };
      }
    } catch (error) {
      console.log(error);
    }
  }

  return router;
};
