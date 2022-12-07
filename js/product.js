// Get id from query string
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

// Gets urls needed
const API_BASE_URL = "https://api.noroff.dev/api/v1";
const viewListingEndpoint = `/auction/listings/${id}`;
const listingUrl = `${API_BASE_URL}${viewListingEndpoint}?_seller=true&_bids=true`;
const makeBidUrl = `${API_BASE_URL}${viewListingEndpoint}/bids`;
//console.log(makeBidUrl);
const deleteUrl = `${API_BASE_URL}/auction/listings/`;

// Gets elements needed
const listingCont = document.getElementById("listing-cont");
const bidsCont = document.getElementById("bids-on-listing");
const bidsHeader = document.getElementById("bids-header");

const profileModal = document.getElementById("profile-info");

const editTitle = document.getElementById("update-title");
const editDesc = document.getElementById("update-description");
const editMedia = document.getElementById("update-main-img");

// Gets listing by id from API
async function getListing(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(url, options);

    const response = await fetch(url, options);
    //console.log(response);
    const listing = await response.json();
    //console.log(listing);
    writeListing(listing, listingCont);
    writeBids(listing, bidsCont);
  } catch (error) {
    console.warn(error);
  }
}
getListing(listingUrl);

// Writes listing info to output element
const writeListing = (listing, outElement) => {
  outElement.innerHTML = "";

  const productImg =
    listing.media.length !== 0
      ? `${listing.media[0]}`
      : [
          "https://github.com/marthebull/semester-project-2022/blob/dev-js/images/product-placeholder-img.jpg?raw=true",
        ];

  const profileImg =
    listing.seller.avatar === "" || listing.seller.avatar === null
      ? [
          "https://github.com/marthebull/semester-project-2022/blob/dev-js/images/placeholder-profile-img.jpg?raw=true",
        ]
      : listing.seller.avatar;

  // Sets time
  const date = new Date(listing.endsAt).getTime();
  const now = new Date().getTime();
  const distance = date - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  let timeLeft = "";

  if (distance > 0) {
    timeLeft = `${days}d ${hours}h ${minutes}m`;
  } else {
    timeLeft = "EXPIRED";
  }

  // Gets and displayes the highest bid
  const allbids = listing.bids;
  let highest = 0;

  function findHighestBid(allbids) {
    if (allbids.length !== 0) {
      highest = allbids
        .map((o) => o.amount)
        .reduce(function (a, b) {
          return Math.max(a, b);
        });
    }
  }
  findHighestBid(allbids);

  outElement.innerHTML = `
            <div class="col-12 col-md-6 d-flex">
                <img class="w-100 listing-img" src="${productImg}" alt="Placeholder image" style="object-fit: cover;">
            </div>
            <div class="col-12 col-md-5 d-flex flex-column justify-content-center col mx-auto p-5 ">
                <div class="mb-4">
                    <h2 class="mb-2">${listing.title}</h2>
                    <div class="d-flex pt-3">
                        <div>
                            <p class="m-1">Highest bid:</p>
                            <p class="m-1"><strong>${highest} credits</strong></p>
                        </div>
                        <div class="ps-3">
                            <p class="m-1 ">Ends in:</p>
                            <p class="m-1"><strong class="timer">${timeLeft}</strong></p>
                        </div>
                    </div>
                </div>
                <p class="pb-3">${listing.description}</p>
                <div>
                    <a data-bs-toggle="modal" data-bs-target="#profile-modal" class="d-flex mb-3 text-black text-decoration-none" style="cursor:pointer;">
                        <img class="rounded-circle profile-img-thumbnail" src="${profileImg}" alt="Profile picture" style="width: 50px;">
                        <div class="ms-2">
                            <p class="mb-0">Listed by</p>
                            <p class="mb-0"><strong>@${listing.seller.name}</strong></p>
                        </div>
                    </a>
                </div>
                <p class="text-danger justify-content-start text-center" id="bid-error-msg"></p>
                <div id="bid-or-login" class="d-flex flex-column justify-content-center">
                    
                </div>
            </div>
            `;

  // Checks if it is the users own listing, if the user is logged in or the listing has expired and displayes different buttons based on that
  const bidOrLogin = document.getElementById("bid-or-login");
  if (
    localStorage.getItem("accessToken") &&
    localStorage.getItem("username") === listing.seller.name
  ) {
    bidOrLogin.innerHTML = "";
    bidOrLogin.innerHTML = `
                    <button id="update-btn" type="button" data-bs-toggle="modal" data-bs-target="#update-modal" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-out">Update listing</button>
                    <button id="delete-btn" type="button" class="btn btn-danger text-white mx-auto text-center mb-4 col-12 hide-out">Delete listing</button>
                    `;
    const deleteBtn = document.getElementById("delete-btn");
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this listing?")) {
        deletePost(listing.id);
      }
    });
    const editBtn = document.getElementById("update-btn");
    editBtn.addEventListener("click", () => {
      editTitle.innerHTML = `${listing.title}`;
      editDesc.innerHTML = `${listing.description}`;
      editMedia.innerHTML = `${listing.media}`;
      console.log(listing.title, listing.description, listing.media);
    });
  } else if (localStorage.getItem("accessToken") && timeLeft !== "EXPIRED") {
    bidOrLogin.innerHTML = `
        <input id="place-bid-input" type="text" class="form-control bg-light border-0 mb-3 hide-out" placeholder="Place a bid">
        <button id="send-bid-btn" type="submit" class="btn btn-primary text-white mx-auto text-center mb-3 col-12 hide-out">Place bid</button>
                    `;
    const sendBidBtn = document.getElementById("send-bid-btn");
    sendBidBtn.addEventListener("click", validateAndProcess);
  } else if (localStorage.getItem("accessToken") && timeLeft === "EXPIRED") {
    bidOrLogin.innerHTML = "";
    bidOrLogin.innerHTML = `
        <p class="mb-0 text-danger pb-3">This listing has expired</p>
        <button id="bid-expired" type="button" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-in">Browse other listings</button>
                    `;
    console.log("went to expired");
    const expiredListingBtn = document.getElementById("bid-expired");
    expiredListingBtn.addEventListener("click", function (e) {
      window.location.href = "../home.html";
      console.log("Klikket på knapp");
    });
  } else {
    bidOrLogin.innerHTML = `
        <button id="login-to-bid" type="button" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-in">Log in to place bid</button>
                    `;
    const loginToBidBtn = document.getElementById("login-to-bid");
    loginToBidBtn.addEventListener("click", function (e) {
      window.location.href = "../index.html";
      console.log("Klikket på knapp");
    });
  }

  // Canges color on expired and active listings
  const timer = document.querySelector(".timer");

  let thisTime = timer.innerHTML;

  if (thisTime !== "EXPIRED") {
    timer.classList.add("not-expired");
  } else {
    timer.classList.add("expired");
  }

  // Writes the sellers info into modal
  profileModal.innerHTML = `
            <img class="mx-auto rounded-circle profile-img mb-4" src="${profileImg}" alt="Profile picture" style="width: 180px; height: 180px; object-fit: cover;">
            <p class="text-center"><strong>@${listing.seller.name}</strong></p>
            <p class="text-center">${listing.seller.email}</p>
            <p class="text-center">Wins: ${listing.seller.wins.length}</p>

  `;
};

// List all bids
const writeBids = (bids, outElement) => {
  outElement.innerHTML = "";
  let newDivs = "";
  bids.bids.reverse();

  const bidCount = bids._count.bids;
  console.log(bidCount);

  for (let i = 0; i < bids.bids.length; i++) {
    let biddersName = bids.bids[i].bidderName;
    let bidAmount = bids.bids[i].amount;
    let biddingDate = new Date(bids.bids[i].created);

    let displaydate = biddingDate.toLocaleString("default", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "numeric",
    });

    let credits = bids.bids[i].amount <= 1 ? "credit" : "credits";

    newDivs += `
            <div class="col pb-4 placeholder-glow">
                <div class="card h-100 border-0 box-shadow-pink p-4">
                    <a class="d-flex mb-4 text-black text-decoration-none">
                        <div class="ms-2">
                            <p class="mb-0"><strong>@${biddersName}</strong></p>
                            <p class="mb-0 text-primary">${displaydate}</p>
                        </div>
                    </a>
                    <p class="pb-1 h2 text-center"><strong>${bidAmount} ${credits}</strong></p>
                </div>
            </div>
            `;
  }
  outElement.innerHTML = newDivs;

  if (bids.bids.length > 0) {
    bidsHeader.innerHTML = `BIDS (${bidCount})`;
  }
};

// Send bid info to API
async function makeBid(url, data) {
  try {
    const accessToken = localStorage.getItem("accessToken");
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
    const bidError = document.getElementById("bid-error-msg");
    if (response.status === 200) {
      window.location.reload();
    } else {
      bidError.innerHTML = answer.errors[0].message;
    }
    //console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

// Prosesses bid input
function validateAndProcess(event) {
  event.preventDefault();
  const bidInput = document.getElementById("place-bid-input").value.trim();
  const bidToSend = parseInt(bidInput);

  let postData = {
    amount: bidToSend,
  };

  makeBid(makeBidUrl, postData);
}

// Deletes listing
async function deletePost(id) {
  const url = `${deleteUrl}${id}`;
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(url, options);
    const response = await fetch(url, options);
    //console.log(response);

    if (response.status == 204) {
      window.location = "../home.html";
    }
  } catch (error) {
    console.log(error);
  }
}

// Update listing modal
async function updateListing(id) {
  const title = editTitle.value.trim();
  const desc = editDesc.value.trim();
  let media = [`${editMedia.value.trim()}`];

  if (media[0] === "") {
    media = [
      "https://github.com/marthebull/semester-project-2022/blob/dev-js/images/product-placeholder-img.jpg?raw=true",
    ];
  }

  console.log(media);
  console.log(title);
  console.log(desc);

  const data = {
    title: title,
    description: desc,
    media: media,
  };

  const url = `${deleteUrl}${id}`;

  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };
    //console.log(url, options);

    const response = await fetch(url, options);
    //console.log(response);
    const updateAnswer = await response.json();
    // console.log(updateAnswer);

    const updateError = document.getElementById("update-error-msg");
    if (response.status === 200) {
      window.location.reload();
    } else {
      updateError.innerHTML = updateAnswer.errors[0].message;
    }
  } catch (error) {
    console.warn(error);
  }
}

const updateSubmit = document.getElementById("update-submit");
updateSubmit.addEventListener("click", () => {
  updateListing(id);
});
