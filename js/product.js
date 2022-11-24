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
const loginToBidBtn = document.getElementById("login-to-bid");

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
    //console.log(listing);
    //listingData(listing);
  } catch (error) {
    console.warn(error);
  }
}

// Kaller funksjonen som henter poost
getListing(listingUrl);

// Sends user to login page if not logged in
loginToBidBtn.addEventListener("click", function (e) {
  window.location.href = "../index.html";
  console.log("Klikket på knapp");
});
