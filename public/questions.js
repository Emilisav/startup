// Populate Questions
//localStorage.setItem("questions", []);

//topQuestions();
//setTitle();

//setInterval(getNewestQuestions, 3000);

function getName() {
  if (
    localStorage.getItem("userName") == "undefined" ||
    localStorage.getItem("userName") == null
  ) {
    localStorage.setItem("userName", `Guest${Math.floor(Math.random() * 999)}`);
  }

  return localStorage.getItem("userName");
}

function setTitle() {
  let title = document.getElementById("title");
  title.innerText = "Welcome to TalkShow " + getName() + "!";
}

function getNewestQuestions() {
  // Populate Questions
  try {
    addQuestion(`new question ` + Math.floor(Math.random() * 3000));
  } catch {}
  let questions = loadQuestions();

  updateNewQuestion(questions[2], "1");
  updateNewQuestion(questions[1], "2");
  updateNewQuestion(questions[0], "3");
}

function setStars(numStars, star) {
  let stars = numStars;

  for (let i = 1; i < 6; i++, stars--) {
    let starButton = document.getElementById(star + i);

    if (stars > 0) {
      starButton.checked = true;
      starButton.click;
    } else {
      starButton.checked = false;
      starButton.click;
    }
  }
}

function question() {
  let question = document.querySelector("#addQuestion");

  if (checkQuestion(question.value)) {
    addQuestion(question.value);
    question.value = "";
  } else {
    question.value = "Question already exists";
  }
}

function checkQuestion(question) {
  let questions = loadQuestions();

  let found = false;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].question == question) {
      found = true;
    }
  }

  return found;
}

function addQuestion(question) {
  let userName = getName();
  let time = Date.now();
  let stars = 0;
  let ratings = 0;

  let questions = loadQuestions();

  if (checkQuestion(question)) {
    questions.push({
      question: question,
      userName: userName,
      stars: stars,
      numRatings: ratings,
      date: time,
    });

    if (questions.length > 2) {
      questions.sort((a, b) => b.date - a.date);
    }
  } else {
    throw question;
  }

  updateQuestions(questions);
}

function topQuestions() {
  questions = loadQuestions();

  try {
    questions.sort((a, b) => b.stars - a.stars);
  } catch {
    addQuestion(`What number would you like to be on a sports team and why?`);
    addQuestion(
      `Since events seem to always happen in threes, what is the next thing to happen to you?`
    );
    addQuestion(`What type of books do you take on vacation?`);
    addQuestion(`What event do you wish you had season tickets to?`);
    addQuestion(`What's your gift?`);

    questions = loadQuestions();
    questions.sort((a, b) => b.stars - a.stars);
  }

  for (let i = 0; i < 5; i++) {
    updateTopQuestion(questions[i], "q" + (i + 1));
  }
}

function updateTopQuestion(question, id) {
  setStars(question.stars, id);
  let questionText = document.getElementById(id);
  questionText.innerHTML = id[1] + ". " + question.question;
}

function updateNewQuestion(question, id) {
  setStars(Math.round(Math.random() * 5), "s" + id);
  let questionText = document.getElementById("newQuestion" + id);
  questionText.innerHTML = question.question;
}

async function chatGPT() {
  const keyResponse = await fetch("/api/key");
  key = await keyResponse.json();

  await fetch(
    "https://degrawchatgpt.openai.azure.com/openai/deployments/degraw/chat/completions?api-version=2024-02-15-preview",
    {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "What questions do I ask on a date?",
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 0.95,
        stop: null,
      }),
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const containerEl = document.querySelector("#gpt");

      const answerEl = document.createElement("p");
      answerEl.classList.add("answer");

      answerEl.textContent = data.content;

      containerEl.appendChild(answerEl);
    });
}

async function star(id) {
  star = document.getElementById(id);
  question = document.getElementById(id.substring(0, 2));
  let questions = loadQuestions;

  qElement = questions.find((q) => q.question === question.innerText.substr(3));

  if (star.checked) {
    qElement.stars =
      (qElement.stars * qElement.numRatings + 1) / (qElement.numRatings + 1);
    qElement.numRatings++;
  } else {
    qElement.stars =
      (qElement.stars * qElement.numRatings - 1) / (qElement.numRatings + 1);
    qElement.numRatings++;
  }

  await updateQuestions(questions);
}

async function loadQuestions() {
  let questions = [];
  try {
    // Get the latest questions from the service
    const response = await fetch("/api/questions");
    questions = await response.json();

    // Save the questions in case we go offline in the future
    localStorage.setItem("questions", JSON.stringify(questions));
  } catch {
    // If there was an error then just use the last saved questions
    const questionsText = localStorage.getItem("questions");
    if (questionsText) {
      questions = JSON.parse(questionsText);
    } else {
      questions = [];
    }
  }

  return questions;
}

async function updateQuestions(newQuestions) {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newQuestions),
    });

    // Store what the service gave us as the high scores
    const questions = await response.json();
  } catch {}

  localStorage.setItem("questions", JSON.stringify(questions));
}
