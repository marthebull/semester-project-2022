import { toTopBtn, backToTop } from "./to-top.js";

// Display/hide things when logged in/logged out

// sign in/log out nav-menu
  function hideOut() {
    const loggedIn = localStorage.getItem("accessToken");
    if (!loggedIn) {
        const creditsBoxes = document.getElementsByClassName("hide-out");
        for (var i = 0; i < creditsBoxes.length; i += 1) {
          creditsBoxes[i].style.display = "none";
        }
    } 
  }

  hideOut();

  function hideIn() {
    const loggedIn = localStorage.getItem("accessToken");
    if (loggedIn) {
      const creditsBoxes = document.getElementsByClassName("hide-in");
      for (var i = 0; i < creditsBoxes.length; i += 1) {
        creditsBoxes[i].style.display = "none";
      }
    }
  }

  hideIn();



// Credits amount
const API_BASE_URL = `https://api.noroff.dev/api/v1`;
const userName = localStorage.getItem("username");
const profileEndpoint = `/auction/profiles/${userName}`;
const profileUrl = `${API_BASE_URL}${profileEndpoint}`;

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

// Henter all profilinfo
getProfile(profileUrl);




  

  








  
  
  



  


