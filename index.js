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

// Get Questions
apiRouter.get("/key33", (_req, res) => {
  res.send(readSecret());
});

function readSecret() {
  const fs = require("fs");

  // Path to the file containing the secret
  const filePath = "key.txt";

  // Read the secret from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    return data;
  });
}

// Submit Questions
apiRouter.post("/questions", (req, res) => {
  questions = updateQuestions(req.body, questions);

  res.send(questions);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// updateScores considers a new score for inclusion in the high scores.
// The high scores are saved in memory and disappear whenever the service is restarted.
let questions = [];
function updateQuestions(newQuestion, questions) {
  let found = false;
  for (const [i, prevScore] of questions.entries()) {
    if (newQuestion.score > prevScore.score) {
      questions.splice(i, 0, newQuestion);
      found = true;
      break;
    }
  }

  if (!found) {
    questions.push(newQuestion);
  }

  return questions;
}
