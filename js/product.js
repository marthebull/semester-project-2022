// get the query string
const queryString = document.location.search;
// create an object that will allows us to access all the query string parameters
const params = new URLSearchParams(queryString);
// get the id parameter from the query string
const API_BASE_URL = "https://api.noroff.dev/api/v1";
const id = params.get("id");
//console.log(id);
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

// Gets listing by id
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
    console.log(listing);
    writeListing(listing, listingCont);
    writeBids(listing, bidsCont);
  } catch (error) {
    console.warn(error);
  }
}

// Calls function who gets listinginfo
getListing(listingUrl);

// Writes listing info to output element
const writeListing = (listing, outElement) => {
  outElement.innerHTML = "";

  const productImg =
    listing.media.length !== 0
      ? `${listing.media[0]}`
      : [
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        ];

  const profileImg =
    listing.seller.avatar === "" || listing.seller.avatar === null
      ? [
          "https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg",
        ]
      : listing.seller.avatar;

  const description = listing.description !== null ? listing.description : "";

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

  // highest bid
  const allbids = listing.bids;
  let highest = 0;
  //console.log(allbids);

  function findHighestBid(allbids) {
    if (allbids.length !== 0) {
      highest = allbids
        .map((o) => o.amount)
        .reduce(function (a, b) {
          return Math.max(a, b);
        });
      //console.log(highest);
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
                <p class="pb-3">${description}</p>
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

  const bidOrLogin = document.getElementById("bid-or-login");

  if (
    localStorage.getItem("accessToken") &&
    localStorage.getItem("username") === listing.seller.name
  ) {
    bidOrLogin.innerHTML = "";
    bidOrLogin.innerHTML = `
                    <button id="delete-btn" type="button" class="btn btn-danger text-white mx-auto text-center mb-4 col-12 hide-out">Delete listing</button>
                    `;

    const deleteBtn = document.getElementById("delete-btn");
    //console.log(deleteBtns);

    deleteBtn.addEventListener("click", () => {
      //console.log(btnDelete.getAttribute("data-delete"));
      if (confirm("Are you sure you want to delete this listing?")) {
        deletePost(listing.id);
      }
    });
  }
  // Checks if logged in or not, display login btn or bid btn
  else if (localStorage.getItem("accessToken") && timeLeft !== "EXPIRED") {
    bidOrLogin.innerHTML = `
        <input id="place-bid-input" type="text" class="form-control bg-light border-0 mb-3 hide-out" placeholder="Place a bid">
        <button id="send-bid-btn" type="submit" class="btn btn-primary text-white mx-auto text-center mb-3 col-12 hide-out">Place bid</button>
                    `;
    const sendBidBtn = document.getElementById("send-bid-btn");
    sendBidBtn.addEventListener("click", validateAndProcess);

    //console.log(timeLeft);
  } else if (localStorage.getItem("accessToken") && timeLeft === "EXPIRED") {
    bidOrLogin.innerHTML = "";
    bidOrLogin.innerHTML = `
        <p class="mb-0 text-danger pb-3">This listing has expired</p>
        <button id="bid-expired" type="button" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-in">Browse other listings</button>
                    `;
    console.log("went to expired");
    const expiredListingBtn = document.getElementById("bid-expired");
    // Sends user to home page to browser other listings
    expiredListingBtn.addEventListener("click", function (e) {
      window.location.href = "../home.html";
      console.log("Klikket på knapp");
    });
  } else {
    bidOrLogin.innerHTML = `
        <button id="login-to-bid" type="button" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-in">Log in to place bid</button>
                    `;
    const loginToBidBtn = document.getElementById("login-to-bid");
    // Sends user to login page if not logged in
    //console.log("went to logged out");
    loginToBidBtn.addEventListener("click", function (e) {
      window.location.href = "../home.html";
      console.log("Klikket på knapp");
    });
  }

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

  //profileModal; Writes sellers info into modal
  profileModal.innerHTML = `
            <img class="mx-auto rounded-circle profile-img mb-4" src="${profileImg}" alt="Profile picture" style="width: 180px; height: 180px; object-fit: cover;">
            <p class="text-center"><strong>@${listing.seller.name}</strong></p>
            <p class="text-center">${listing.seller.email}</p>
            <p class="text-center">Wins: ${listing.seller.wins.length}</p>

  `;
};

// list all bids
const writeBids = (bids, outElement) => {
  outElement.innerHTML = "";
  let newDivs = "";
  bids.bids.reverse();

  const bidCount = bids._count.bids;
  console.log(bidCount);

  for (let i = 0; i < bids.bids.length; i++) {
    //console.log(bids.bids[i].bidderName, bids.bids[i].amount, bids.bids[i].created);

    let biddersName = bids.bids[i].bidderName;
    let bidAmount = bids.bids[i].amount;
    let biddingDate = new Date(bids.bids[i].created);
    //console.log(biddingDate);

    let displaydate = biddingDate.toLocaleString("default", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "numeric",
    });
    //console.log(displaydate);

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

// Make bid
async function makeBid(url, data) {
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
    console.log(response);
    const answer = await response.json();
    const bidError = document.getElementById("bid-error-msg");
    if (response.status === 200) {
      window.location.reload();
    } else {
      bidError.innerHTML = answer.errors[0].message;
    }
    console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

// Prosesses and validates bid input
function validateAndProcess(event) {
  event.preventDefault();
  const bidInput = document.getElementById("place-bid-input").value.trim();
  const bidToSend = parseInt(bidInput);
  console.log(bidToSend);

  let postData = {
    amount: bidToSend,
  };

  makeBid(makeBidUrl, postData);
}

// deletes listing
async function deletePost(id) {
  //console.log(id);
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
    console.log(url, options);
    const response = await fetch(url, options);
    console.log(response);

    if (response.status == 204) {
      window.location = "../home.html";
    }
  } catch (error) {
    console.log(error);
  }
}
