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

