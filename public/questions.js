// Populate Questions
localStorage.setItem("questions", []);

setTitle();
topQuestions();
setBackground();

setInterval(getNewestQuestions, 10000);

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

async function getNewestQuestions() {
  // Populate Questions

  let questions = await loadQuestions();

  questions.sort((a, b) => b.date - a.date);

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

async function question() {
  let question = document.querySelector("#addQuestion");

  if (await checkQuestion(question.value)) {
    addQuestion(question.value);
    question.value = "";
  } else {
    question.value = "Question already exists";
  }
}

async function checkQuestion(question) {
  let questions = await loadQuestions();

  let isNew = true;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].question == question) {
      isNew = false;
    }
  }

  return isNew;
}

async function addQuestion(question) {
  let userName = getName();
  let time = Date.now();
  let stars = 0;
  let ratings = 0;

  updateQuestions({
    question: question,
    userName: userName,
    stars: stars,
    numRatings: ratings,
    date: time,
  });
}

async function topQuestions() {
  questions = await loadQuestions();

  questions.sort((a, b) => b.stars - a.stars);

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
  const keyResponse = await fetch("/api/gpt").then((data) => {
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
  let questions = await loadQuestions();

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

  updateStars(qElement);
}

async function updateStars(question) {
  try {
    const response = await fetch("/api/star", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(question),
    });
    const questions = await response.json();
    localStorage.setItem("questions", JSON.stringify(questions));
  } catch {}
}

async function loadQuestions() {
  try {
    // Get the latest questions from the service
    const qResponse = await fetch("/api/questions");
    let questions = await qResponse.json();

    // Save the questions in case we go offline in the future
    localStorage.setItem("questions", JSON.stringify(questions));
    return questions;
  } catch {
    // If there was an error then just use the last saved questions
    const questionsText = localStorage.getItem("questions");
    if (questionsText) {
      return JSON.parse(questionsText);
    } else {
      return [];
    }
  }
}

async function updateQuestions(newQuestion) {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newQuestion),
    });

    // Store what the service gave us as the high scores
    const questions = await response.json();
    localStorage.setItem("questions", JSON.stringify(questions));
  } catch {}
}

async function setBackground() {
  const random = Math.floor(Math.random() * 1000);
  fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
    .then((response) => response.json())
    .then((data) => {
      const containerEl = document.querySelector("#background");
      const width = containerEl.offsetWidth;
      const height = containerEl.offsetHeight;
      const imgUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}`;
      containerEl.setAttribute("style", `background-image: url(${imgUrl})`);

      /* 
      const containerEl = document.querySelector("#accordionExample");

      const width = containerEl.offsetWidth;
      const height = containerEl.offsetHeight;

      const imgUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}`;
      const imgEl = document.createElement("img");
      imgEl.setAttribute("src", imgUrl);
      containerEl.appendChild(imgEl);
      */
    });
}
