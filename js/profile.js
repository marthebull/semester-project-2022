const API_BASE_URL = `https://api.noroff.dev/api/v1`;
const userName = localStorage.getItem("username");
const profileEndpoint = `/auction/profiles/${userName}?_listings=true`;
const profileUrl = `${API_BASE_URL}${profileEndpoint}`;

const profileListingsUrl = `${API_BASE_URL}/auction/profiles/${userName}/listings`;

// getting elements
const listingsOutput = document.getElementById("listings-output");
const profileImg = document.getElementsByClassName("profile-img");
const profileInfoOutput = document.getElementById("profile-info");

async function getListings(url) {
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
    const listings = await response.json();
    console.log(listings);
    writeListings(listings, listingsOutput);
  } catch (error) {
    console.warn(error);
  }
}

getListings(profileListingsUrl);

// Henter alle egne poster
/*
const profileImg =
  profile.avatar.value !== ""
    ? profile.avatar.value
    : [
        "https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg",
      ];
*/

// Writes all listings to outElement
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

    /*

    let date = new Date(content.endsAt).getTime();

    let counter = setInterval(function () {
      let now = new Date().getTime();

      let distance = date - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const timer = document.querySelector(".timer");
      timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s `;
      timer.classList.add("not-expired");

      if (distance < 0) {
        clearInterval(counter);
        timer.innerHTML = "EXPIRED";
        timer.classList.remove("not-expired");
        timer.classList.add("expired");
      }
    }, 1000);*/
    /*

    const date = new Date(content.endsAt).getTime();

    let counter = setInterval(function () {
      const now = new Date().getTime();

      const distance = date - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const timer = document.querySelector(".timer");

      if (distance > 0) {
        timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s `;
        timer.classList.add("not-expired");
        //console.log(deadline);
      } else {
        clearInterval(counter);
        timer.innerHTML = "EXPIRED";
        //console.log(deadline);
        timer.classList.remove("not-expired");
        timer.classList.add("expired");
      }
    }, 1000);*/

    newDivs += `
            <div class="col pb-4">
                <div class="card h-100 border-0 box-shadow-pink">
                    <img src="${productImg}" class="card-img-top card-img-size" alt="Product">
                    <div class="card-body p-4">
                        <h5 class="card-title"><a href="product.html" class="text-black text-decoration-none stretched-link">${listing.title}</a></h5>
                        <a href="#" class="d-flex mb-3 pt-2 text-black text-decoration-none">
                        <div class="ms-2">
                            <p class="mb-0">Listed by</p>
                            <p class="mb-0"><strong>you</strong></p>
                        </div>
                    </a>
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <p class="m-1">Bids:</p>
                                <p class="m-1"><strong>${listing._count.bids}</strong></p>
                            </div>
                            <div>
                                <p class="m-1 text-end">Ends in:</p>
                                <p class="m-1"><strong class="timer">00:00:00</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  }

  outElement.innerHTML = newDivs;
};

// getting profile info
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
      : "https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg";
  outElement.innerHTML = `
            <p class="text-end text-primary">Edit</p>
            <img class="mx-auto rounded-circle profile-img" src="${profileImg}" alt="Profile picture" style="width: 180px; height: 180px; object-fit: cover;">
            <h1 class="text-center mb-5 pt-4 knewave smaller">@${profile.name}</h1>
            <p class="text-center">Credits: ${profile.credits}</p>
            <p class="text-center">Active listings: ${profile.listings.length}</p>
            <p class="text-center">Wins: ${profile.wins.length}</p>
            `;
};
