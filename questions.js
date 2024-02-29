// Populate Questions
try {
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
      localStorage.setItem(
        "userName",
        `Guest${Math.floor(Math.random() * 999)}`
      );
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
    let questions = localStorage.getItem("questions");
    if (questions) {
      questions = JSON.parse(questions);
    } else {
      questions = [];
    }

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
    return true;
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

    if (checkQuestion(question)) {
      questions.push({
        question: question,
        userName: userName,
        stars: stars,
        date: time,
      });

      if (questions.length > 2) {
        questions.sort((a, b) => b.date - a.date);
      }
    } else {
      throw question;
    }
    localStorage.setItem("questions", JSON.stringify(questions));
  }

  function topQuestions() {
    let questionText = localStorage.getItem("questions");

    let questions = JSON.parse(questionText);

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

  function chatGPT() {
    let question = document.querySelector("#helpQuestion");

    question.value = "Called ChatGPT";
    setTimeout(
      () =>
        (question.value =
          "What do I ask someone who like oranges to discover what else they like?"),
      10000
    );
  }
} catch {
  console.log("Error");
}
