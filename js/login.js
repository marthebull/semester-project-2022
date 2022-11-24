const API_BASE_URL = "https://api.noroff.dev/api/v1";
const loginEndpoint = "/auction/auth/login";
const loginUrl = `${API_BASE_URL}${loginEndpoint}`;

// Getting all elements needed to login
const form = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const loginBtn = document.getElementById("login-submit");

const formMsg = document.getElementById("login-form-msg");
const emailMsg = document.getElementById("login-email-msg");
const passwordMsg = document.getElementById("login-password-msg");

// Validating login input
loginBtn.addEventListener("click", validateForm);

function validateForm(e) {
  e.preventDefault();

  let submittedEmail = emailInput.value.trim();
  console.log(`Email: ${submittedEmail}`);
  emailMsg.innerHTML = "";
  let emailPattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (!emailPattern.test(submittedEmail)) {
    emailMsg.innerHTML =
      "Email can only contain characters, numbers, dot, hyphen and underscore.";
  }
  if (submittedEmail.length < 11) {
    emailMsg.innerHTML = "Please enter a valid email.";
  }
  if (
    !(
      submittedEmail.includes("@noroff.no") ||
      submittedEmail.includes("@stud.noroff.no")
    )
  ) {
    emailMsg.innerHTML = "Email must include @stud.noroff.no or @noroff.no.";
  }

  let submittedPassword = passwordInput.value.trim();
  console.log(`Message: ${submittedPassword}`);

  passwordMsg.innerHTML = "";
  if (submittedPassword.length < 8) {
    passwordMsg.innerHTML = "Password must be at least 8 characters long.";
  }
}

// Prosesses inputs
loginBtn.addEventListener("click", validateAndProcess);
function validateAndProcess(event) {
  event.preventDefault();
  console.log("du har trykket");

  const data = {
    email: emailInput.value.trim().toLowerCase(),
    password: passwordInput.value.trim(),
  };

  loginUser(loginUrl, data);
}

// Logges in user
async function loginUser(url, data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    //console.log(url, data, options);

    const response = await fetch(url, options);
    console.log(response);
    const answer = await response.json();
    console.log(answer);

    if (answer.statusCode === 401) {
      emailMsg.innerHTML = "Invalid email or password.";
    }

    localStorage.setItem("username", answer.name);
    localStorage.setItem("accessToken", answer.accessToken);
    if (response.status === 200) {
      window.location = "../home.html";
    }
  } catch (error) {
    console.warn(error);
  }
}
