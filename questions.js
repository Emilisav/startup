// Populate Questions

//TODO
localStorage.setItem("questions", []);

addQuestion(`What number would you like to be on a sports team and why?`);
addQuestion(
  `Since events seem to always happen in threes, what is the next thing to happen to you?`
);
addQuestion(`What type of books do you take on vacation?`);
addQuestion(`What event do you wish you had season tickets to?`);
addQuestion(`What's your gift?`);

topQuestions();
setTitle();

setInterval(getNewestQuestions, 3000);

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
  addQuestion(`new question ` + Math.floor(Math.random() * 3000));

  let questions = localStorage.getItem("questions");
  if (questions) {
    questions = JSON.parse(questions);
  } else {
    questions = [];
  }
  setStars(Math.round(Math.random() * 5), "s1");
  let questionText = document.getElementById("newQuestion1");
  questionText.innerHTML = questions[2].question;

  setStars(Math.round(Math.random() * 5), "s2");
  questionText = document.getElementById("newQuestion2");
  questionText.innerHTML = questions[1].question;

  setStars(Math.round(Math.random() * 5), "s3");
  questionText = document.getElementById("newQuestion3");
  questionText.innerHTML = questions[0].question;
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

function addQuestion(question) {
  let userName = getName();
  let time = Date.now();
  let stars = 0;

  let questionText = localStorage.getItem("questions");
  if (questionText) {
    questions = JSON.parse(questionText);
  } else {
    questions = [];
  }
  questions.push({
    question: question,
    userName: userName,
    stars: stars,
    date: time,
  });

  if (questions.length > 2) {
    questions.sort((a, b) => b.date - a.date);
  }
  localStorage.setItem("questions", JSON.stringify(questions));
}

function topQuestions() {
  let questionText = localStorage.getItem("questions");

  let questions = JSON.parse(questionText);

  questions.sort((a, b) => a.stars - b.stars);
  setStars(questions[0].stars, "q1");
  questionText = document.getElementById("q1");
  questionText.innerHTML = "1. " + questions[0].question;

  setStars(questions[1].stars, "q2");
  questionText = document.getElementById("q2");
  questionText.innerHTML = "2. " + questions[1].question;

  setStars(questions[2].stars, "q3");
  questionText = document.getElementById("q3");
  questionText.innerHTML = "3. " + questions[2].question;

  setStars(questions[3].stars, "q4");
  questionText = document.getElementById("q4");
  questionText.innerHTML = "4. " + questions[3].question;

  setStars(questions[4].stars, "q5");
  questionText = document.getElementById("q5");
  questionText.innerHTML = "5. " + questions[4].question;
}
