function login() {
  guest();

  let name = document.querySelector("#name");
  let psw = document.querySelector("#psw");

  if (check(name, psw)) {
    localStorage.setItem("userName", name.value);
    localStorage.setItem("password", psw.value);
  } else {
    throw "Wrong Password";
  }
}

function check(name, psw) {
  return true;
}

function guest() {
  localStorage.removeItem("userName");
  localStorage.removeItem("password");
}
