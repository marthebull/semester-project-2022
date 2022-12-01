// APi urls
const API_BASE_URL = `https://api.noroff.dev/api/v1`;
const userName = localStorage.getItem("username");
const profileEndpoint = `/auction/profiles/${userName}?_listings=true`;
const profileUrl = `${API_BASE_URL}${profileEndpoint}`;

const profileListingsUrl = `${API_BASE_URL}/auction/profiles/${userName}/listings`;

const updateAvatarUrl = `${API_BASE_URL}/auction/profiles/${userName}/media`;

// getting elements
const listingsOutput = document.getElementById("listings-output");
const profileImg = document.getElementsByClassName("profile-img");
const profileInfoOutput = document.getElementById("profile-info");

const updateAvatarMsg = document.getElementById("update-avatar-msg");
const newAvatarInput = document.getElementById("new-avatar");
const saveNewAvatarBtn = document.getElementById("save-new-avatar");

async function getListings(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Please sign in to see profile.");
      window.location.href = "../index.html";
    }
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
    const listings = await response.json();
    console.log(listings);
    writeListings(listings, listingsOutput);
  } catch (error) {
    console.warn(error);
  }
}

getListings(profileListingsUrl);

// Writes all listings by this profile to outElement
const writeListings = (list, outElement) => {
  outElement.innerHTML = "";
  let newDivs = "";

  for (let listing of list) {
    const productImg =
      listing.media.length !== 0
        ? `${listing.media[0]}`
        : [
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
          ];
    console.log(listing);

    // sets time
    const date = new Date(listing.endsAt).getTime();
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

    newDivs += `
            <div class="col pb-4">
                <div class="card h-100 border-0 box-shadow-pink">
                    <img src="${productImg}" class="card-img-top card-img-size" alt="Product">
                    <div class="card-body p-4">
                        <h5 class="card-title"><a href="product.html?id=${listing.id}" class="text-black text-decoration-none stretched-link">${listing.title}</a></h5>
                        <p class="m-1">${listing.description}</p>
                        <div class="d-flex justify-content-between pt-3 mb-3">
                            <div>
                                <p class="m-1">Bids:</p>
                                <p class="m-1"><strong>${listing._count.bids}</strong></p>
                            </div>
                            <div>
                                <p class="m-1 text-end">Ends in:</p>
                                <p class="m-1"><strong class="timer">${timeLeft}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  }

  outElement.innerHTML = newDivs;

  // Canges color og expired og active listings
  const timer = document.getElementsByClassName("timer");

  for (let i = 0; i < timer.length; i++) {
    let content = timer[i].innerHTML;
    //console.log(content);

    let thisTime = content;
    if (thisTime !== "EXPIRED") {
      timer[i].classList.add("not-expired");
      //console.log(deadline);
    } else {
      //console.log(deadline);
      timer[i].classList.remove("not-expired");
      timer[i].classList.add("expired");
    }
  }

  // Delete btns
  const deleteBtns = document.querySelectorAll("button.btnDelete");
  //console.log(deleteBtns);
  for (let btnDelete of deleteBtns) {
    btnDelete.addEventListener("click", () => {
      //console.log(btnDelete.getAttribute("data-delete"));
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(btnDelete.getAttribute("data-delete"));
      }
    });
  }
};

// getting profile info
async function getProfile(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "../index.html";
    }
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
    console.log(profile);
    writeProfileInfo(profile, profileInfoOutput);
  } catch (error) {
    console.warn(error);
  }
}

getProfile(profileUrl);

// Writes all profile info outElement
const writeProfileInfo = (profile, outElement) => {
  outElement.innerHTML = "";

  const profileImg =
    profile.avatar != ""
      ? `${profile.avatar}`
      : "https://github.com/marthebull/semester-project-2022/blob/dev-js/images/placeholder-profile-img.jpg?raw=true";
  outElement.innerHTML = `
            
            <img class="mx-auto rounded-circle profile-img" src="${profileImg}" alt="Profile picture" style="width: 180px; height: 180px; object-fit: cover;">
            <p class="text-center mb-5 pt-4"><strong>@${profile.name}</strong></p>
            <p class="text-center">Credits: ${profile.credits}</p>
            <p class="text-center">Listings: ${profile.listings.length}</p>
            <p class="text-center mb-4">Wins: ${profile.wins.length}</p>
            <button type="button" data-bs-toggle="modal" data-bs-target="#avatar-modal" class="btn btn-primary text-white col-12 col-sm-6 col-lg-12 mx-auto">Edit avatar</button>
            `;
};

// Updateing avatar

async function updateAvatar(url, data) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    //console.log(accessToken);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };
    //console.log(url, data, options);
    // opp i api
    const response = await fetch(url, options);
    //console.log(response);
    const answer = await response.json();
    console.log(answer);
    if (answer.statusCode) {
      updateAvatarMsg.innerHTML =
        "Invalid image URL. Your URL should match this pattern : https://url.com/image.jpg";
    }

    if (answer.name) {
      window.location.reload();
    }

    //console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

saveNewAvatarBtn.addEventListener("click", newAvatar);
function newAvatar(event) {
  event.preventDefault();
  const avatarUrl = newAvatarInput.value.trim();

  let postData = {
    avatar: avatarUrl,
  };

  updateAvatar(updateAvatarUrl, postData);
}
