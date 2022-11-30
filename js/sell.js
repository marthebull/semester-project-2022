const API_BASE_URL = "https://api.noroff.dev/api/v1";
const sellEndpoint = "/auction/listings";
const sellUrl = `${API_BASE_URL}${sellEndpoint}`;

// Input fields and submit button
const listingTitle = document.getElementById("listing-title");
const listingDate = document.getElementById("listing-date");
const listingTime = document.getElementById("listing-time");
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
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
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
listingMainImg.addEventListener("keyup", preview, test);

function test() {
  console.log(listingMainImg.value);
}

async function preview() {
  // teste img først og gi den et navn, sende den inn i preview boks og
  //sjekke om den er noe eller ikke, enten sette inn den url eller placeholder

  previewCont.innerHTML = `
                <div class="card border-0 box-shadow-pink">
                    <h1 class="text-center mb-5 pt-4 knewave text-primary" style="position: absolute; left: -20px;">preview</h1>
                    <img id="preview-img" src="${
                      listingMainImg.value !== ""
                        ? listingMainImg.value
                        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    } " class="card-img-top card-img-size" alt="Product picture placeholder"/>
                    <div class="card-body p-4">
                        <h5 id="preview-title" class="card-title"><a href="#" class="text-black text-decoration-none stretched-link">${
                          listingTitle.value
                        }</a></h5>
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <p class="m-1">Bids:</p>
                                <p class="m-1"><strong>0</strong></p>
                            </div>
                            <div>
                                <p class="m-1 text-end">Ends at:</p>
                                <p class="text-success m-1"><strong>00d 00h 00m 00s</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
  `;
}
