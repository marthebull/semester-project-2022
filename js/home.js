const API_BASE_URL = "https://api.noroff.dev/api/v1";
const allListingsEndpoint =
  "/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc";
const allListingsUrl = `${API_BASE_URL}${allListingsEndpoint}`;

const outElement = document.getElementById("listings-feed");
const searchBar = document.getElementById("search-bar");

//console.log(postCollection);

let listingsCollection = [];

async function getAllListings(url) {
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
    listingsCollection = listings;
    writeListings(listings, outElement);
  } catch (error) {
    console.warn(error);
  }
}

// Gets all listings
getAllListings(allListingsUrl);

// Writes all listings to outElement
const writeListings = (list, outElement) => {
  outElement.innerHTML = "";
  let newDivs = "";

  for (let content of list) {
    const productImg =
      content.media.length !== 0
        ? `${content.media[0]}`
        : [
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
          ];

    const profileImg =
      content.seller.avatar === "" || content.seller.avatar === null
        ? [
            "https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg",
          ]
        : content.seller.avatar;

    // sets time
    const date = new Date(content.endsAt).getTime();
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
                        <h5 class="card-title"><a href="product.html?id=${content.id}" class="text-black text-decoration-none stretched-link">${content.title}</a></h5>
                        <a href="#" class="d-flex mb-3 pt-2 text-black text-decoration-none">
                        <img class="rounded-circle profile-img-thumbnail" src="${profileImg}" alt="">
                        <div class="ms-2">
                            <p class="mb-0">Listed by</p>
                            <p class="mb-0"><strong>@${content.seller.name}</strong></p>
                        </div>
                    </a>
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <p class="m-1">Bids:</p>
                                <p class="m-1"><strong>${content._count.bids}</strong></p>
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
};

// Search by title, description, tags
searchBar.addEventListener("keyup", search);

function search() {
  const filterQuery = searchBar.value.toLowerCase();
  console.log(filterQuery);

  const filteredList = listingsCollection.filter((listing) => {
    //console.log(listing.title);

    //console.log(listingsCollection.length);
    const listingTitle = listing.title.toLowerCase();
    const listingName = listing.seller.name.toLowerCase();

    //console.log(postTitle, postAuthor, postBody);
    if (listingTitle.indexOf(filterQuery) > -1) return true;
    if (listingName.indexOf(filterQuery) > -1) return true;

    return false;
  });

  writeListings(filteredList, outElement);
}
