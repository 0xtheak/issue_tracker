// JavaScript code to toggle visibility of input field based on dropdown selection
const labelsDropdown = document.getElementById("label");
const newLabelInput = document.getElementById("labels");
newLabelInput.style.display = "none";

labelsDropdown?.addEventListener("change", function () {
  if (this.value === "other") {
    newLabelInput.style.display = "block";
  } else {
    newLabelInput.style.display = "none";
  }
});