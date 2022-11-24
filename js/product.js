// get the query string
const queryString = document.location.search;
// create an object that will allows us to access all the query string parameters
const params = new URLSearchParams(queryString);
// get the id parameter from the query string
const API_BASE_URL = "https://api.noroff.dev/api/v1";
const id = params.get("id");
console.log(id);
const viewListingEndpoint = `/auction/listings/${id}`;
const listingUrl = `${API_BASE_URL}${viewListingEndpoint}?_seller=true&_bids=true`;

// Gets elements needed
const listingCont = document.getElementById("listing-cont");

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
  } catch (error) {
    console.warn(error);
  }
}

// Kaller funksjonen som henter poost
getListing(listingUrl);

// Writes listing info to output element
const writeListing = (listing, outElement) => {
  outElement.innerHTML = "";

  const productImg =
    listing.media.length !== 0
      ? `${listing.media[0]}`
      : [
          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
        ];

  const profileImg =
    listing.seller.avatar === "" || listing.seller.avatar === null
      ? [
          "https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg",
        ]
      : listing.seller.avatar;

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

  outElement.innerHTML = `
            <div class="col-12 col-md-6 mx-auto d-flex justify-content-center">
                <img class="w-100 rounded" src="${productImg}" alt="Placeholder image" style="object-fit: cover;">
            </div>
            <div class="col-12 col-md-5 d-flex flex-column justify-content-center col mx-auto pt-5 pt-md-2">
                <div class="mb-4">
                    <h2 class="mb-2">${listing.title}</h2>
                    <div class="d-flex pt-3">
                        <div>
                            <p class="m-1">Highest bid:</p>
                            <p class="m-1"><strong>24</strong></p>
                        </div>
                        <div class="ps-3">
                            <p class="m-1 ">Ends in:</p>
                            <p class="m-1"><strong class="timer">${timeLeft}</strong></p>
                        </div>
                    </div>
                </div>
                <p class="pb-3">${listing.description}</p>
                <div>
                    <a href="#" class="d-flex mb-5 text-black text-decoration-none">
                        <img class="rounded-circle profile-img-thumbnail" src="${profileImg}" alt="Profile picture" style="width: 50px;">
                        <div class="ms-2">
                            <p class="mb-0">Listed by</p>
                            <p class="mb-0"><strong>@${listing.seller.name}</strong></p>
                        </div>
                    </a>
                </div>
                <div id="bid-or-login" class="d-flex flex-column justify-content-center">
                    
                </div>
            </div>
            `;

  // Checks if logged in or not, display login btn or bid btn
  const bidOrLogin = document.getElementById("bid-or-login");

  if (localStorage.getItem("accessToken")) {
    bidOrLogin.innerHTML = `
        <input type="text" class="form-control bg-light border-0 mb-3 hide-out" placeholder="Place a bid">
        <button type="submit" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-out">Place bid</button>
                    `;
  } else {
    bidOrLogin.innerHTML = `
        <button id="login-to-bid" type="button" class="btn btn-primary text-white mx-auto text-center mb-4 col-12 hide-in">Log in to place bid</button>
                    `;
    const loginToBidBtn = document.getElementById("login-to-bid");
    // Sends user to login page if not logged in
    loginToBidBtn.addEventListener("click", function (e) {
      window.location.href = "../index.html";
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
};
