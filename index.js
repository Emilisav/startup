const express = require("express");
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static("public"));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get Questions
apiRouter.get("/questions", (_req, res) => {
  res.send(questions);
});

// ask chatGPT something
apiRouter.get("/gpt", async (_req, res) => {
  let answer = await askGPT(_req.body);
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
            content: "question",
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

  return response2[0].message.content;
}

// Submit Questions
apiRouter.post("/questions", (req, res) => {
  questions = updateQuestion(req.body, questions);

  res.send(questions);
});

// Update stars
apiRouter.post("/star", (req, res) => {
  questions = updateStar(req.body, questions);

  res.send(questions);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public/" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// updateScores considers a new score for inclusion in the high scores.
// The high scores are saved in memory and disappear whenever the service is restarted.
let questions = [
  {
    question: "What number would you like to be on a sports team and why?",
    userName: "ned",
    stars: 0,
    numRatings: 0,
    date: 0,
  },
  {
    question:
      "Since events seem to always happen in threes, what is the next thing to happen to you?",
    userName: "ned",
    stars: 0,
    numRatings: 0,
    date: 0,
  },
  {
    question: "What type of books do you take on vacation?",
    userName: "ned",
    stars: 0,
    numRatings: 0,
    date: 0,
  },
  {
    question: "What event do you wish you had season tickets to?",
    userName: "ned",
    stars: 0,
    numRatings: 0,
    date: 0,
  },
  {
    question: "What's your gift?",
    userName: "ned",
    stars: 0,
    numRatings: 0,
    date: 0,
  },
];
function updateQuestion(newQuestion) {
  let found = false;
  for (const [i, prevScore] of questions.entries()) {
    if (newQuestion.question == prevScore) {
      found = true;
      break;
    }
  }

  if (!found) {
    questions.push(newQuestion);
  }

  return questions;
}

function updateStar(newQuestion, questions) {
  questions.find((q) => q.question === newQuestion.question).stars =
    newQuestion.stars;
  return questions;
}

setInterval(getNewestQuestions, 10000);

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
}
