const disableClasses = [
  "border-transparent",
  "hover:text-gray-600",
  "hover:border-gray-300",
  "dark:hover:text-gray-300",
];

const activeClasses = [
  "text-blue-600",
  "border-blue-600",
  "active dark:text-blue-500",
  "dark:border-blue-500",
];

function lgInf() {
  const loginInfluencer = document.getElementById("infLogInSec");
  const loginRetailer = document.getElementById("reLogInSec");
  const rText = document.getElementById("rText");
  const iText = document.getElementById("iText");
  loginRetailer.classList.add("hidden");
  loginInfluencer.classList.remove("hidden");
  for (let x in disableClasses) {
    rText.classList.add(disableClasses[x]);
    iText.classList.remove(disableClasses[x]);
  }
  for (let x in activeClasses) {
    rText.classList.remove(activeClasses[x]);
    iText.classList.add(activeClasses[x]);
  }
}

function lgRe() {
  const loginInfluencer = document.getElementById("infLogInSec");
  const loginRetailer = document.getElementById("reLogInSec");
  loginRetailer.classList.remove("hidden");
  loginInfluencer.classList.add("hidden");
  const rText = document.getElementById("rText");
  const iText = document.getElementById("iText");
  for (let x in disableClasses) {
    rText.classList.remove(disableClasses[x]);
    iText.classList.add(disableClasses[x]);
  }
  for (let x in activeClasses) {
    rText.classList.add(activeClasses[x]);
    iText.classList.remove(activeClasses[x]);
  }
}

function scroller(x) {
  window.scrollBy(0, x);
}

function jumper() {
  window.location.replace("home.html");
}

// get references to the input fields and the submit button
const retailerEmail = document.getElementById("r_email");
const retailerPassowrd = document.getElementById("r_password");
const retailerSubmit = document.getElementById("r_submit");

// add a click event listener to the submit button
retailerSubmit.addEventListener("click", () => {
  // read the values of the input fields
  const r_email = retailerEmail.value;
  const r_password = retailerPassowrd.value;

  // create a request object with the input values as the body
  const request = new Request("/retailers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: r_email, password: r_password }),
  });

  // send the request using fetch()
  fetch(request)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // do something with the response data
    })
    .catch((error) => {
      console.error(error);
    });
});

// get references to the input fields and the submit button
const influencerEmail = document.getElementById("i_email");
const influencerPassowrd = document.getElementById("i_password");
const influencerSubmit = document.getElementById("i_submit");

// add a click event listener to the submit button
influencerSubmit.addEventListener("click", () => {
  // read the values of the input fields
  const i_email = influencerEmail.value;
  const i_password = influencerPassowrd.value;

  // create a request object with the input values as the body
  const request = new Request("/influencers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: i_email, password: i_password }),
  });

  // send the request using fetch()
  fetch(request)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // do something with the response data
    })
    .catch((error) => {
      console.error(error);
    });
});
