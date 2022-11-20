let toTopBtn = document.getElementById("btn-back-to-top");

toTopBtn.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

export default backToTop();
