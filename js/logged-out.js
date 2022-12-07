// Gets elements needed
const logoutBtns = document.getElementsByClassName("log-out");

// Adds eventlisteners to log-out nav element to all pages (because the nav is set up static on each page)
for (let btn of logoutBtns) {
  btn.addEventListener("click", logout());
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
}

// Tells user you are logged out and redirects to home-page after 1 sec
setTimeout(function () {
  window.location.href = "../home.html";
}, 1000);
