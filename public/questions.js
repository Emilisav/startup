localStorage.setItem("questions", []);

setTitle();
topQuestions();
setBackground();

setInterval(getNewestQuestions, 1000);

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
  if (questions.length > 3) {
    questions.sort((a, b) => b.date - a.date);

    updateNewQuestion(questions[2], "s1");
    updateNewQuestion(questions[1], "s2");
    updateNewQuestion(questions[0], "s3");
  }
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
  if (questions.length > 5) {
    questions.sort((a, b) => b.stars - a.stars);

    for (let i = 0; i < 5; i++) {
      updateTopQuestion(questions[i], "q" + (i + 1));
    }
  }
}

function updateTopQuestion(question, id) {
  setStars(question.stars, id);
  let questionText = document.getElementById(id);
  questionText.innerHTML = id[1] + ". " + question.question;
}

function updateNewQuestion(question, id) {
  setStars(question.stars, id);
  let questionText = document.getElementById(id);
  questionText.innerHTML = question.question;
}

async function chatGPT() {
  let asked = document.querySelector("#helpQuestion").value;

  try {
    const keyResponse = await fetch("/api/gpt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: asked }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg) {
          window.location.href = "index.html";
          throw msg;
        }
        const containerEl = document.querySelector("#gpt");

        const answerEl = document.createElement("p");

        answerEl.textContent = data.content;

        containerEl.appendChild(answerEl);
      });
  } catch (error) {
    console.log(error);
  }
}

async function star(id) {
  let starEl = document.getElementById(id);
  let questionEl = document.getElementById(id.substring(0, 2));

  if (id.substring(0, 1) == "s") {
    q = questionEl.innerText;
  } else {
    q = questionEl.innerText.substring(3);
  }
  if (starEl.checked) {
    try {
      const response = await fetch("/api/star", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (response.msg) {
        window.location.href = "index.html";
        throw msg;
      }
      const questions = await response.json();
      localStorage.setItem("questions", JSON.stringify(questions));
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const response = await fetch("/api/star", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (response.msg) {
        window.location.href = "index.html";
        throw msg;
      }
      const questions = await response.json();
      localStorage.setItem("questions", JSON.stringify(questions));
    } catch (error) {
      console.log(error);
    }
  }

  topQuestions();
}

async function loadQuestions() {
  try {
    // Get the latest questions from the service
    const qResponse = await fetch("/api/questions");
    let questions = await qResponse.json();
    if (questions.msg) {
      window.location.href = "index.html";
      throw msg;
    }
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

    const questions = await response.json();
    if (questions.msg) {
      window.location.href = "index.html";
      throw msg;
    }
    localStorage.setItem("questions", JSON.stringify(questions));
  } catch (error) {
    console.log(error);
  }
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
    });
}
