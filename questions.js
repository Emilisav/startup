function getName() {
  return localStorage.getItem("userName") ?? "Guest${Math.random() * 999}";
}

// Simulate chat messages that will come over WebSocket
setInterval(getNewestQuestions, 5000);

async function getNewestQuestions() {
  let questions = localStorage.getItem("questions");
  questions = newestQuestions(questions);

  //let question = questions[0];
  let question = `A new question ` + Math.floor(Math.random() * 3000);
  setStars(Math.round(Math.random() * 5), "s1");

  let questionText = document.getElementById("newQuestion1");
  questionText.innerHTML = question;
  //questions.splice(questionID);

  //question = questions[1];
  question = `A new question ` + Math.floor(Math.random() * 3000);
  setStars(Math.round(Math.random() * 5), "s2");

  questionText = document.getElementById("newQuestion2");
  questionText.innerHTML = question;
  //questions.splice(questionID);

  //question = questions[2];
  question = `A new question ` + Math.floor(Math.random() * 3000);
  setStars(Math.round(Math.random() * 5), "s3");

  questionText = document.getElementById("newQuestion3");
  questionText.innerHTML = question;
}

function newestQuestions(questions) {
  if (questions != null) {
    questions.sort((a, b) => a.date - b.date);
    return questions.slice(0, 3);
  }
  return null;
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
