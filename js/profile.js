const API_BASE_URL = `https://api.noroff.dev/api/v1`;
const userName = localStorage.getItem("username");
const profileEndpoint = `/auction/profiles/${userName}`;
const profileUrl = `${API_BASE_URL}${profileEndpoint}`;


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
    console.log(url, options);

    const response = await fetch(url, options);
    //console.log(response);
    const profile = await response.json();
    console.log(profile);


  } catch (error) {
    console.warn(error);
  }
}

// Henter alle egne poster
getProfile(profileUrl);

export { getProfile };

