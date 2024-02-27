function login() {
  let name = document.querySelector("#name");
  let psw = document.querySelector("#psw");

  localStorage.setItem("userName", name.value);
  localStorage.setItem("password", psw.value);

  window.location.href = "questions.html";
}

function guest() {
  let name = Math.random() * 999;

  localStorage.setItem("userName", name.value);

  window.location.href = "questions.html";
}
