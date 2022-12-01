const API_BASE_URL = "https://api.noroff.dev/api/v1";
const sellEndpoint = "/auction/listings";
const sellUrl = `${API_BASE_URL}${sellEndpoint}`;

// Input fields and submit button
const listingTitle = document.getElementById("listing-title");
const listingDate = document.getElementById("listing-date");
//const listingTime = document.getElementById("listing-time");
const listingDescription = document.getElementById("listing-description");
const listingMainImg = document.getElementById("listing-main-img");
const listingSubmit = document.getElementById("listing-submit");

// Error message boxes
const listingTitleMsg = document.getElementById("listing-title-msg");
const listingDateMsg = document.getElementById("listing-date-msg");
const listingTimeMsg = document.getElementById("listing-time-msg");
const listingDescriptionMsg = document.getElementById(
  "listing-description-msg"
);
const listingMainImgMsg = document.getElementById("listing-main-img-msg");

// Preview elements
let previewCont = document.getElementById("preview-cont");
const previewTitle = document.getElementById("preview-title");
const previewImg = document.getElementById("preview-img");

// Checking if user is logged in
function isLoggedin() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    alert("Please sign in to list something.");
    window.location.href = "../index.html";
  }
}

isLoggedin();

// Creates new listing
async function listIt(url, data) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    //console.log(accessToken);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };
    //console.log(url, data, options);
    const response = await fetch(url, options);
    //console.log(response);
    const answer = await response.json();
    console.log(answer);
    if (answer.id) {
      previewCont.innerHTML = "";

      previewCont.innerHTML = `
        <h1 class="text-center mx-auto pt-4 knewave text-primary">Its been listed!</h1>
        `;
      setTimeout(function () {
        window.location.href = "../home.html";
      }, 2000);
    }
    console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

// Prosesses and validates user input
listingSubmit.addEventListener("click", validateAndProcess);
function validateAndProcess(event) {
  event.preventDefault();
  const title = listingTitle.value.trim();
  const description = listingDescription.value.trim();
  let media = [`${listingMainImg.value.trim()}`];

  if (media[0] === "") {
    media = [
      "https://github.com/marthebull/semester-project-2022/blob/dev-js/images/product-placeholder-img.jpg?raw=true",
    ];
  }

  console.log(media);

  const bidEnds = listingDate.value.trim();
  console.log(bidEnds);
  const endsAt = `${bidEnds}:00.000Z`;

  let listingData = {
    title: title,
    description: description,
    media: media,
    endsAt: endsAt,
  };

  let submittedTitle = listingTitle.value.trim();
  console.log(`Title: ${submittedTitle}`);

  listingTitleMsg.innerHTML = "";
  if (submittedTitle.length == "") {
    listingTitleMsg.innerHTML = "Please enter a title.";
    return false;
  }

  let submittedDescription = listingDescription.value.trim();
  console.log(`Description: ${submittedDescription}`);

  listingDescriptionMsg.innerHTML = "";
  if (submittedDescription.length < 1) {
    listingDescriptionMsg.innerHTML = "Please enter a short description.";
  }

  listIt(sellUrl, listingData);
}

// setting date in cal to the day after today as default
function settingDate() {
  var date = new Date();

  var minutes = date.getMinutes();
  var hours = date.getHours();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  console.log(date);

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  var today = year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
  console.log(today);
  listingDate.value = today;
  console.log(listingDate.value);
}
settingDate();

// show preview
listingTitle.addEventListener("keyup", preview);
listingMainImg.addEventListener("keyup", preview);
listingDescription.addEventListener("keyup", preview);
listingDate.addEventListener("change", preview);

async function preview() {
  // teste img først og gi den et navn, sende den inn i preview boks og
  //sjekke om den er noe eller ikke, enten sette inn den url eller placeholder

  // sets time
  const date = new Date(listingDate.value).getTime();
  const now = new Date().getTime();
  const distance = date - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let timeLeft = "";

  if (distance > 0) {
    timeLeft = `${days}d ${hours}h ${minutes}m`;
  } else {
    timeLeft = "EXPIRED";
  }

  previewCont.innerHTML = `
                <div class="card border-0 box-shadow-pink">
                    <h1 class="text-center mb-5 pt-4 knewave text-primary" style="position: absolute; left: -20px;">preview</h1>
                    <img id="preview-img" src="${
                      listingMainImg.value !== ""
                        ? listingMainImg.value
                        : "https://github.com/marthebull/semester-project-2022/blob/dev-js/images/product-placeholder-img.jpg?raw=true"
                    } " class="card-img-top card-img-size" alt="Product picture placeholder"/>
                    <div class="card-body p-4">
                        <h5 id="preview-title" class="card-title"><a href="#" class="text-black text-decoration-none stretched-link">${
                          listingTitle.value
                        }</a></h5>
                        <p class="pb-3">${listingDescription.value}</p>
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <p class="m-1">Bids:</p>
                                <p class="m-1"><strong>0</strong></p>
                            </div>
                            <div>
                                <p class="m-1 text-end">Ends in:</p>
                                <p class="text-success m-1"><strong class="timer">${timeLeft}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
  `;

  const timer = document.querySelector(".timer");

  let content = timer.innerHTML;
  console.log(content);

  let thisTime = content;
  if (thisTime !== "EXPIRED") {
    timer.classList.add("not-expired");
    //console.log(deadline);
  } else {
    //console.log(deadline);
    timer.classList.remove("not-expired");
    timer.classList.add("expired");
  }
}
