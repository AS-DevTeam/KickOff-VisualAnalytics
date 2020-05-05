// Function to open the menu
function openNav() {
    var nav = document.getElementById("nav")
    nav.style.width = "15vw";
    nav.style.borderLeftWidth = "8px";
    nav.style.borderLeftStyle = "solid";
    nav.style.borderLeftColor = "rgb(69, 148, 86)";
}

// Function to close the nav
function closeNav() {
    var nav = document.getElementById("nav")
    nav.style.width = "0";
    nav.style.borderLeftColor = "";
    nav.style.borderLeftWidth = "0px";
}