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



const movieSearchInput = document.getElementById("header-movie-search-input");
const movieSearchWrap = document.getElementById("search-result-wrap-id");

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

window.onload = async () => {

  const res = await fetch("/recommendedMovies");
  const list = await res.json();


  const RecommendMainIMG = document.querySelector('#movie-recommend-main img');
  const Recommendmainspan = document.querySelector('#movie-recommend-main span');

  RecommendMainIMG.src = "/image/" + list[0].movieID + "/b.webp";
  Recommendmainspan.innerHTML = list[0].movieTitel;
  
  
  const MovieRecommendListdivs = document.querySelectorAll('#movie-recommend-movie-list > div');

  for (let i = 0; i < 6; i++)
  {
    const img = MovieRecommendListdivs[i].querySelector("img");
    const source = MovieRecommendListdivs[i].querySelector("source");
    const span = MovieRecommendListdivs[i].querySelector("span");

    img.src = "/image/" + list[i+1].movieID + "/v.webp";
    source.srcset = "/image/" + list[i+1].movieID + "/s.webp";
    span.innerHTML = list[i+1].movieTitel;
  }

}