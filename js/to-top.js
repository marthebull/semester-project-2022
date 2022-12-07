// Gets element
const toTopBtn = document.getElementById("btn-back-to-top");

// Adds eventlistener som user is sendt to top when clicked
toTopBtn.addEventListener("click", backToTop);
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// exports so it can be imported (tried modules, this works, imported to main.js)
export { toTopBtn, backToTop };
