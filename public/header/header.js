const dropdownSVG = document.getElementById("Sign-in-dropdown-SVG");
const dropdown = document.getElementById("Sign-in-dropdown");

let dropDownIsDown = false;

dropdownSVG.addEventListener("click", (e) => {

  const children = dropdownSVG.children;

  if (dropDownIsDown == false)
  {
    children[0].style.transform = "rotate(45deg) scale(1.2)";
    children[1].style.opacity = "0";
    children[2].style.transform = "rotate(-45deg) scale(1.2)";

    dropdown.style.pointerEvents = "auto";
    dropdown.style.opacity = "1";
    dropdown.style.transform = "translateY(0)";

    dropDownIsDown = true;
  }
  else
  {
    children[0].style.transform = "translateY(-35%)";
    children[1].style.opacity = "1";
    children[2].style.transform = "translateY(35%)";

    dropdown.style.pointerEvents = "none";
    dropdown.style.opacity = "0";
    dropdown.style.transform = "translateY(-20px)";

    dropDownIsDown = false;
  }
});