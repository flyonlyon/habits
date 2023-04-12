function showPopup() {
    document.getElementById("popup").style.display = "block";
} // showPopup()

function hidePopup() {
    document.getElementById("popup").style.display = "none";
} // hidePopup()

function submitForm() {
    document.getElementById("form").reset();
    document.getElementById("submit-text").style.display = "block";
} // submitForm()