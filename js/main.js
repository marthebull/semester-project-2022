import { toTopBtn, backToTop } from "./to-top.js";

// Gets urls needed
const API_BASE_URL = `https://api.noroff.dev/api/v1`;
const userName = localStorage.getItem("username");
const profileEndpoint = `/auction/profiles/${userName}`;
const profileUrl = `${API_BASE_URL}${profileEndpoint}`;

// Display/hide things when logged in/logged out
function hideOut() {
  const loggedIn = localStorage.getItem("accessToken");
  if (!loggedIn) {
    const hideElements = document.getElementsByClassName("hide-out");
    for (var i = 0; i < hideElements.length; i += 1) {
      hideElements[i].style.display = "none";
    }
  }
}
hideOut();

function hideIn() {
  const loggedIn = localStorage.getItem("accessToken");
  if (loggedIn) {
    const hideElements = document.getElementsByClassName("hide-in");
    for (var i = 0; i < hideElements.length; i += 1) {
      hideElements[i].style.display = "none";
    }
  }
}
hideIn();

// Gets and displayes credits amount if signed in
async function getProfile(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(url, options);
    const response = await fetch(url, options);
    //console.log(response);
    const profile = await response.json();
    const myCredits = profile.credits;
    const loggedIn = localStorage.getItem("accessToken");
    if (loggedIn) {
      document.querySelector(".saldo").innerHTML = `
        <div class="credits bg-white box-shadow-pink">
            <p class="fw-semibold">Credits : <span> ${myCredits} </span> </p>
        </div>`;
    }
    //console.log(profile);
  } catch (error) {
    console.warn(error);
  }
}
getProfile(profileUrl);
