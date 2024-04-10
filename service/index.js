const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const db = require("./db.js");
const { newQuestionsProxy } = require("./newQuestionsProxy.js");

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
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
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
apiRouter.delete("/auth/logout", (_req, res) => {
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
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// Get Questions
secureApiRouter.get("/questions", async (_req, res) => {
  const questions = await db.getQuestions();
  res.send(questions);
});

// ask chatGPT something
secureApiRouter.post("/gpt", async (_req, res) => {
  let answer = await askGPT(_req.body.question);
  res.send(answer);
});

async function askGPT(question) {
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

  return response2[0].message;
}

// Submit Questions
secureApiRouter.post("/questions", (req, res) => {
  questions = updateQuestion(req.body);

  res.send(questions);
});

// Update stars
secureApiRouter.post("/star", async (req, res) => {
  questions = await db.incStar(req.body.question);

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
  let found = false;
  const questions = await db.getQuestions();

  for (const [i, prevScore] of questions.entries()) {
    if (newQuestion.question == prevScore) {
      found = true;
      break;
    }
  }

  if (!found) {
    db.addQuestion(newQuestion);
  }

  return questions;
}

// Populate Questions
updateQuestion({
  question: "What number would you like to be on a sports team and why?",
  userName: "ned",
  stars: 0,
  numRatings: 0,
  date: 0,
});
updateQuestion({
  question:
    "Since events seem to always happen in threes, what is the next thing to happen to you?",
  userName: "ned",
  stars: 0,
  numRatings: 0,
  date: 0,
});
updateQuestion({
  question: "What type of books do you take on vacation?",
  userName: "ned",
  stars: 0,
  numRatings: 0,
  date: 0,
});
updateQuestion({
  question: "What event do you wish you had season tickets to?",
  userName: "ned",
  stars: 0,
  numRatings: 0,
  date: 0,
});
updateQuestion({
  question: "What's your gift?",
  userName: "ned",
  stars: 0,
  numRatings: 0,
  date: 0,
});

function updateStar(newQuestion, questions) {
  questions.find((q) => q.question === newQuestion.question).stars =
    newQuestion.stars;
  return questions;
}

/*setInterval(getNewestQuestions, 10000);

function getNewestQuestions() {
  let userName = "websocket";
  let time = Date.now();
  let stars = 0;
  let ratings = 0;

  updateQuestion({
    question: `new question ` + Math.floor(Math.random() * 3000),
    userName: userName,
    stars: stars,
    numRatings: ratings,
    date: time,
  });
}*/

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

newQuestionsProxy(httpService);
