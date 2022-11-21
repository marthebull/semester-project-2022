const logoutBtns = document.getElementsByClassName("log-out");

for (let btn of logoutBtns) {
  btn.addEventListener("click", logout());
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
}

setTimeout(function () {
  window.location.href = "../home.html";
}, 2000);
