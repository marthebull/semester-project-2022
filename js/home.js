const API_BASE_URL = "https://api.noroff.dev/api/v1";
const allListingsEndpoint = "/auction/listings";
const allListingsUrl = `${API_BASE_URL}${allListingsEndpoint}`;

const outElement = document.getElementById("listings-feed");




let listingCollection = [];
//console.log(postCollection);

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
    const listing = await response.json();
    console.log(listing);
    listingCollection = listing;
    //console.log("Colletion:", postCollection);
    writeListings(listing, outElement);
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
    let date = new Date(content.endsAt);
    let deadline = setInterval(function () {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = date - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      const timer = document.querySelector(".timer");
      timer.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      timer.classList.add("not-expired");
      

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(deadline);
        timer.innerHTML = "EXPIRED";
      }
    }, 1000);
    newDivs += `
            <div class="col pb-4">
                <div class="card h-100 border-0 box-shadow-pink">
                    <img src="${content.media}" class="card-img-top card-img" alt="Product"/>
                    <div class="card-body p-4">
                        <h5 class="card-title"><a href="product.html" class="text-black text-decoration-none stretched-link">${content.title}</a></h5>
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <p class="m-1">Bids:</p>
                                <p class="m-1"><strong>${content._count.bids}</strong></p>
                            </div>
                            <div>
                                <p class="m-1 text-end">Deadline:</p>
                                <p class="m-1"><strong class="timer expired">EXPIRED</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  }

  outElement.innerHTML = newDivs;
};


