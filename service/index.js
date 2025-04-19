const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const db = require("./db.js");
const llm = require("./LLM.js");
const { newQuestionsProxy } = require("./newQuestionsProxy.js");
const uuid = require("uuid");

const authCookieName = "token";

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static("public"));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set("trust proxy", true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post("/auth/login", async (req, res) => {
  const user = await db.getUser(req.body.name);

  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await db.updateUser(user);
      setAuthCookie(res, user.token);
      return res.send({ id: user._id });
    }

    res.status(401).send({ msg: "Unauthorized" });
  } else {
    const user = await db.createUser(req.body.name, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// DeleteAuth token if stored in cookie
apiRouter.delete("/auth/logout", async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await db.getUserByToken(token);
  if (user) {
    user.token = null;
    await db.updateUser(user);
  }

  res.clearCookie(authCookieName);
  res.status(204).end();
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await db.getUserByToken(authToken);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// Get Questions
secureApiRouter.get("/questions", async (_req, res) => {
  const questions = await db.getQuestions();
  res.send(questions); // Return ALL questions
});

// ask chatGPT something
secureApiRouter.post("/gpt", async (req, res) => {
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

// Submit Questions
secureApiRouter.post("/questions", async (req, res) => {
  const newQuestion = req.body;
  const updatedQuestions = await updateQuestion(newQuestion);

  // Broadcast the raw question data to all clients immediately
  proxy.broadcast({
    type: "new_question",
    question: {
      question: newQuestion,
      date: new Date().toISOString(), // Add timestamp if not present
      userName: req.user?.name || "Guest", // Add user info if available
    },
  });

  res.send(updatedQuestions);
});

// Update stars
secureApiRouter.post("/star", async (req, res) => {
  questions = await db.incStar(req.body.question);
  proxy.broadcast({ type: "questions_updated" });
  res.send(questions);
});

// Update stars
secureApiRouter.delete("/star", async (req, res) => {
  questions = await db.decStar(req.body.question);

  res.send(questions);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public/" });
});

// updateScores considers a new score for inclusion in the high scores.
// The high scores are saved in memory and disappear whenever the service is restarted.
let questions = [];
async function updateQuestion(newQuestion) {
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

function updateStar(newQuestion, questions) {
  questions.find((q) => q.question === newQuestion.question).stars =
    newQuestion.stars;
  return questions;
}

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let proxy = newQuestionsProxy(httpService);
