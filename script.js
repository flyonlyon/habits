function showPopup() {
    document.getElementById("popup").style.display = "block";
    const a = document.createElement('a')
    a.href = "habits-extension.zip"
    a.download = "habits-extension.zip".split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
} // showPopup()

function hidePopup() {
    document.getElementById("popup").style.display = "none";
} // hidePopup()

function submitForm() {
    document.getElementById("form").reset();
    document.getElementById("submit-text").style.display = "block";
} // submitForm()