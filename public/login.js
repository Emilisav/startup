async function login() {
  let name = document.querySelector("#name")?.value;
  let psw = document.querySelector("#psw")?.value;
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "post",
      body: JSON.stringify({ name: name, password: psw }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.ok) {
      localStorage.setItem("userName", name);
      window.location.href = "questions.html";
    } else {
      const body = await response.json();
      const modalEl = document.querySelector("#left");
      const answerEl = document.createElement("p");

      answerEl.textContent = `⚠ Error: ${body.msg}`;

      modalEl.appendChild(answerEl);
    }
  } catch (error) {
    console.log(error);
  }
}

async function guest() {
  let name = "guest";
  let psw = "password";
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "post",
      body: JSON.stringify({ name: name, password: psw }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.ok) {
      localStorage.setItem(
        "userName",
        `Guest${Math.floor(Math.random() * 999)}`
      );
      window.location.href = "questions.html";
    } else {
      const body = await response.json();
      const modalEl = document.querySelector("#psw");
      modalEl.textContent = `⚠ Error: ${body.msg}`;
    }
  } catch (error) {
    console.log(error);
  }
}
