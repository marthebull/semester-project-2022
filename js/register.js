// Gets urls needed
const API_BASE_URL = "https://api.noroff.dev/api/v1";
const regEndpoint = "/auction/auth/register";
const registerUrl = `${API_BASE_URL}${regEndpoint}`;

// Getting all elements needed to register
const form = document.getElementById("reg-form");
const usernameInput = document.getElementById("reg-username");
const emailInput = document.getElementById("reg-email");
const passwordInput = document.getElementById("reg-password");
const avatarInput = document.getElementById("reg-avatar");
const registerBtn = document.getElementById("reg-btn");
const errorMsg = document.getElementById("error-msg");

const usernameMsg = document.getElementById("reg-username-msg");
const emailMsg = document.getElementById("reg-email-msg");
const passwordMsg = document.getElementById("reg-password-msg");
const avatarMsg = document.getElementById("reg-avatar-msg");

// Form validation
registerBtn.addEventListener("click", validateForm);

function validateForm(e) {
  e.preventDefault();

  let submittedUsername = usernameInput.value.trim();
  //console.log(`Username: ${submittedUsername}`);
  usernameMsg.innerHTML = "";
  if (submittedUsername.length < 5) {
    usernameMsg.innerHTML = "Username must be at least 5 characters long.";
  }
  let usernamePattern = /^[A-Za-z0-9_]+$/;
  if (!usernamePattern.test(submittedUsername)) {
    usernameMsg.innerHTML =
      "Username can only contain characters, digits and underscore.";
  }

  let submittedEmail = emailInput.value.trim();
  //console.log(`Email: ${submittedEmail}`);
  emailMsg.innerHTML = "";
  let emailPattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (!emailPattern.test(submittedEmail)) {
    emailMsg.innerHTML =
      "Email can only contain characters, numbers, dot, hyphen and underscore.";
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
  //console.log(`Password: ${submittedPassword}`);
  passwordMsg.innerHTML = "";
  if (submittedPassword.length < 8) {
    passwordMsg.innerHTML = "Password must be at least 8 characters long.";
  }

  let submittedAvatar = avatarInput.value.trim();
  //console.log(`Avatar URL: ${submittedAvatar}`);
  avatarMsg.innerHTML = "";
  let avatarPattern = /\.(jpeg|jpg|gif|png|svg)$/;
  if (submittedAvatar.value == "") {
    avatarInput.innerHTML =
      "https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg";
    //console.log(`Avatar URL: https://upload.wikimedia.org/wikipedia/commons/4/48/No_image_%28male%29.svg`);
  } else if (
    !submittedAvatar.value == "" &&
    !avatarPattern.test(submittedAvatar)
  ) {
    avatarMsg.innerHTML = "Please enter a valid avatar url.";
  }
}

// Prosesses user input and registers user
registerBtn.addEventListener("click", validateAndProcess);

function validateAndProcess(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const avatar = avatarInput.value.trim();

  const userToRegister = {
    name: username,
    email: email,
    password: password,
    avatar: avatar,
  };
  registerUSer(registerUrl, userToRegister);
}

async function registerUSer(url, userData) {
  console.log(url, userData);
  try {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    const response = await fetch(registerUrl, postData);
    //console.log(response);
    const json = await response.json();
    //console.log(json);

    if (response.status === 201) {
      window.location = "./index.html";
    } else if (json.errors[0].message === "Profile already exists") {
      errorMsg.innerHTML = `Profile already exists. Try to <a href="../index.html">log in</a> instead.`;
    }
  } catch (error) {
    console.log(error);
  }
}
