const dropdownSVG = document.getElementById("Sign-in-dropdown-SVG");
const dropdown = document.getElementById("Sign-in-dropdown");

let dropDownIsDown = false;

// when dropdoen clicked, display dropdown and play animation
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


const movieSearchInput = document.getElementById("header-movie-search-input");
const movieSearchWrap = document.getElementById("search-result-wrap-id");
// when the user writes in the search bar, call get moviesByName with the search bar value as a peramiter and display the results in the search drop down
movieSearchInput.addEventListener("input", async function(event) {
  console.log("User typed:", event.target.value)

  if (event.target.value == "")
    {
      return;
    }

  try
  {
    let res = await fetch("/moviesByName?movieName=" + event.target.value);
    let list = await res.json();

    movieSearchWrap.innerHTML = "";

    for (let i = 0; i < list.length; i++)
    {
      
      let a = document.createElement("a");
      let button = document.createElement("button");
      button.innerHTML = list[i].movieTitel;
      a.appendChild(button);

      movieSearchWrap.appendChild(a);
    }

    console.log(list);
  }
  catch (e)
  {
    console.log(e);
  }
});

// if the user is logged in exchange the sign in button with the log out button, and the no account logo with a logo that have teh first letter of your user name
document.addEventListener("DOMContentLoaded", async () => {

  const usernameRes = await fetch("/username", {
    method: "GET",
    credentials: "include"
  })

  if (usernameRes.status == 200)
  {
    
      const button1 = document.getElementById("Sign-in-dropdown-a");
      const button2 = document.getElementById("Sign-in-no-dropdown-a");
    
      button1.innerHTML = "Log Out";
      button2.innerHTML = "Log Out";

      const coverRect = document.getElementsByClassName("coverRect");

      coverRect[0].style.fill = "#0455BF";
      coverRect[1].style.fill = "#0455BF";

      const svgText = document.querySelectorAll(".No-Account-Logo > text");
      svgText[0].style.fill = 'white';
      svgText[1].style.fill = 'white';

      const username = await usernameRes.text(); 

      svgText[0].innerHTML = username[0];
      svgText[1].innerHTML = username[0];
      
  }
});