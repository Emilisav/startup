async function login() {
  let name = document.querySelector("#name")?.value;
  let psw = document.querySelector("#psw")?.value;

  const response = await fetch(endpoint, {
    method: "post",
    body: JSON.stringify({ name: name, password: psw }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (response.ok) {
    localStorage.setItem("userName", name);
  } else {
    const body = await response.json();
    const modalEl = document.querySelector("#msgModal");
    modalEl.querySelector(".modal-body").textContent = `⚠ Error: ${body.msg}`;
    const msgModal = new bootstrap.Modal(modalEl, {});
    msgModal.show();
  }
}

function guest() {
  localStorage.removeItem("userName");
  fetch(`/api/auth/logout`, {
    method: "delete",
  });
}
