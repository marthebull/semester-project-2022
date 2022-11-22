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
const previewCont = document.getElementById("preview-cont");
const previewTitle = document.getElementById("preview-title");
const previewImg = document.getElementById("preview-img");

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
    if (response.status === 200) {
      successNewListing();
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
  let media = listingMainImg.value.trim();
  //const deadline = listingDate.value.trim().getDate();

  //var dateParts = listingDate.value.trim().split("-");
  //var deadline = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  //var endsAt = deadline.toISOString();
  //console.log(endsAt);

  //const date = new Date(listingDate.value.trim());
  //const deadline = date.toUTCString();

  if (media === "")
    media =
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";

  let listingData = {
    title: title,
    description: description,
    media: media,
    endsAt: "2023-01-01T00:00:00.000Z",
  };

  let submittedTitle = listingTitle.value.trim();
  console.log(`Title: ${submittedTitle}`);

  listingTitleMsg.innerHTML = "";
  if (submittedTitle.length < 1) {
    listingTitleMsg.innerHTML = "Please enter a title.";
  }

  let submittedDescription = listingDescription.value.trim();
  console.log(`Description: ${submittedDescription}`);

  listingDescriptionMsg.innerHTML = "";
  if (submittedDescription.length < 1) {
    listingDescriptionMsg.innerHTML = "Please enter a short description.";
  }

  listIt(sellUrl, listingData);
}

// Success message if successfully listed
function successNewListing() {
  previewCont.innerHTML = "";

  previewCont.innerHTML = `
    <h1 class="text-center mx-auto pt-4 knewave text-primary">Its been listed!</h1>
    `;
  setTimeout(function () {
    window.location.href = "../home.html";
  }, 2000);
}
