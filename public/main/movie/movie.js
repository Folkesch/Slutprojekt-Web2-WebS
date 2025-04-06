let gMovieID = null;

window.onload = async () => {
  const moviename = document.querySelector('h1');
  const svgBackground = document.querySelector('#ratingSVG .stars-rect');

  const img = document.querySelector('picture img');
  const imgSource = document.querySelector('picture source');

  const lengthAndRelease = document.querySelector('#movie-length-and-release-date');
  const movieDescription = document.querySelector('#movieDescription');

  const actorSection = document.querySelector('#actorSection');

  const currentURL = window.location.href;

  // get the movie id from the url
  const reg = /id=([0-9]+)/
  const movieID = currentURL.match(reg)[1];
  gMovieID = movieID;

  // call get movie 
  const res = await fetch("/movieData?id=" + movieID);
  const list = await res.json();
  const info = list[0];

  // add the movie data to the page
  document.title = info.movieTitel;
  moviename.innerHTML = info.movieTitel;

  if (info.scoreCount != 0)
  {
    const translate = 100 - ((info.scoreSum / info.scoreCount) / 5) * 100
    svgBackground.style.transform = "translateX(-" + translate + "%)"
  }
  else
  {
    svgBackground.style.transform = "translateX(-100%)"
  }

  img.src = "/image/movies/" + info.movieID + "/v.webp";
  imgSource.srcset = "/image/movies/" + info.movieID + "/b.webp";

  lengthAndRelease.innerHTML = "Movie length: " + info.movieLength + " min. Release date: " + info.releaseDate
  movieDescription.innerHTML = info.movieDescription;

  // call get actors to get all the dataa from the actors associated with this movie
  const res2 = await fetch("/actors?id=" + movieID);
  const list2 = await res2.json();

  actorSection.innerHTML = "";

  for (let i = 0; i < list2.length; i++)
  {
    element = list2[i];

    const div = document.createElement("div");

    div.className = "inline-block mx-2 w-25 h-45 sm:w-35 sm:h-60";
    div.innerHTML = 
    ` 
    
        <div class="flex flex-col gap-2 w-full h-full p-2 bg-[var(--deep-blue)] rounded-md">
          <img class="w-full aspect-1/1 object-cover rounded-md" src="` + "/image/actors/" + element.actorID + ".webp" + `" alt="A pictrue of ` + element.firstName + " " + element.lastName + `">
          <span class="text-white max-w-full overflow-hidden text-balance font-['Roboto'] text-xs sm:text-sm">
            ` + element.firstName + " " + element.lastName + `
          </span>
          <span class="text-white max-w-full overflow-hidden text-balance font-['Roboto'] text-xs sm:text-sm">
            ` + element.characterPlayed + `
          </span>
        </div>

    `

    actorSection.appendChild(div);
  }



  // add review button 

  // call get username, if you get the username it means you are loged in 
  const usernameRes = await fetch("/username", {
    method: "GET",
    credentials: "include"
  })

  const reviewButtonWrap = document.getElementById("review-button-wrap");
  const reviewButton = document.querySelector("#review-button-wrap > button");
  reviewButtonWrap.removeChild(reviewButton);
  
  reviewButton.className

  if (usernameRes.status == 200)
  {
    // if you are loget in add review button
    const button = document.createElement("button");
    button.className = reviewButton.className;
    button.onclick = () => { window.location = '/html/review.html?id=' + movieID }
    button.innerHTML = reviewButton.innerHTML;
    reviewButtonWrap.appendChild(button);
  }

  // add reviews 
  addReviews();
  
}

async function addReviews()
{

  const reviewsWrap = document.getElementById("reviews-wrap");

  reviewsWrap.innerHTML = "";

  const filterStars = document.getElementById("filter-stars");
  const sortBy = document.getElementById("sort-by");

  // call reviews with the filterStars and sortBy selects as inputs 
  const reviewsRes = await fetch("/reviews?movieID=" + gMovieID + "&filterStars=" + filterStars.value + "&sortBy=" + sortBy.value, {
    method: "GET",
  });

  if (reviewsRes.status == 200)
  {
    resJson = await reviewsRes.json();

    // for every review returned add a review to the page with the relevent data 
    for (let i = 0; i < resJson.length; i++)
    {
      reviewsWrap.appendChild(NewReview(resJson[i].username, resJson[i].rating, resJson[i].content));
    }
  }

  if (reviewsWrap.innerHTML == "")
  {
    reviewsWrap.innerHTML = "No reviews were found";
  }
}

// returns a new review based on the input data
function NewReview(username, rating, content)
{
  const template = document.createElement('template');
  template.innerHTML = `
        <div class="w-full sm:w-4/5 p-2 flex flex-col gap-3 my-5 bg-[var(--darkDark-blue)] rounded-lg">

          <div class="w-full flex flex-row gap-x-3 flex-wrap">
            <span class="text-white font-['Rubik'] font-semibold text-lg text-wrap max-w-full overflow-hidden">` + username + `</span>
            <svg id="ratingSVG" class="w-20" viewBox="0 0 1200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect class="stars-background" width="1200" height="240"/>
              <rect class="stars-rect" width="1200" height="240"/>
              <path class="stars-outline" fill-rule="evenodd" clip-rule="evenodd" d="M1200 0H0V240H1200V0ZM122.69 15.451C121.59 13.2212 118.41 13.2212 117.31 15.451L85.4309 80.0447C84.9939 80.9301 84.1492 81.5438 83.1721 81.6858L11.8887 92.0439C9.42804 92.4014 8.44552 95.4253 10.2261 97.1609L61.8072 147.44C62.5143 148.129 62.8369 149.122 62.67 150.096L50.4933 221.091C50.073 223.542 52.6453 225.41 54.8462 224.253L118.604 190.734C119.478 190.274 120.522 190.274 121.396 190.734L185.154 224.253C187.355 225.41 189.927 223.542 189.507 221.091L177.33 150.096C177.163 149.122 177.486 148.129 178.193 147.44L229.774 97.1609C231.554 95.4253 230.572 92.4014 228.111 92.0439L156.828 81.6858C155.851 81.5438 155.006 80.9301 154.569 80.0447L122.69 15.451ZM357.31 15.451C358.41 13.2212 361.59 13.2212 362.69 15.451L394.569 80.0447C395.006 80.9301 395.851 81.5438 396.828 81.6858L468.111 92.0439C470.572 92.4014 471.554 95.4253 469.774 97.1609L418.193 147.44C417.486 148.129 417.163 149.122 417.33 150.096L429.507 221.091C429.927 223.542 427.355 225.41 425.154 224.253L361.396 190.734C360.522 190.274 359.478 190.274 358.604 190.734L294.846 224.253C292.645 225.41 290.073 223.542 290.493 221.091L302.67 150.096C302.837 149.122 302.514 148.129 301.807 147.44L250.226 97.1609C248.446 95.4253 249.428 92.4014 251.889 92.0439L323.172 81.6858C324.149 81.5438 324.994 80.9301 325.431 80.0447L357.31 15.451ZM602.69 15.451C601.59 13.2212 598.41 13.2212 597.31 15.451L565.431 80.0447C564.994 80.9301 564.149 81.5438 563.172 81.6858L491.889 92.0439C489.428 92.4014 488.446 95.4253 490.226 97.1609L541.807 147.44C542.514 148.129 542.837 149.122 542.67 150.096L530.493 221.091C530.073 223.542 532.645 225.41 534.846 224.253L598.604 190.734C599.478 190.274 600.522 190.274 601.396 190.734L665.154 224.253C667.355 225.41 669.927 223.542 669.507 221.091L657.33 150.096C657.163 149.122 657.486 148.129 658.193 147.44L709.774 97.1609C711.555 95.4253 710.572 92.4014 708.111 92.0439L636.828 81.6858C635.851 81.5438 635.006 80.9301 634.569 80.0447L602.69 15.451ZM837.31 15.451C838.41 13.2212 841.59 13.2212 842.69 15.451L874.569 80.0447C875.006 80.9301 875.851 81.5438 876.828 81.6858L948.111 92.0439C950.572 92.4014 951.555 95.4253 949.774 97.1609L898.193 147.44C897.486 148.129 897.163 149.122 897.33 150.096L909.507 221.091C909.927 223.542 907.355 225.41 905.154 224.253L841.396 190.734C840.522 190.274 839.478 190.274 838.604 190.734L774.846 224.253C772.645 225.41 770.073 223.542 770.493 221.091L782.67 150.096C782.837 149.122 782.514 148.129 781.807 147.44L730.226 97.1609C728.445 95.4253 729.428 92.4014 731.889 92.0439L803.172 81.6858C804.149 81.5438 804.994 80.9301 805.431 80.0447L837.31 15.451ZM1082.69 15.451C1081.59 13.2212 1078.41 13.2212 1077.31 15.451L1045.43 80.0447C1044.99 80.9301 1044.15 81.5438 1043.17 81.6858L971.889 92.0439C969.428 92.4014 968.445 95.4253 970.226 97.1609L1021.81 147.44C1022.51 148.129 1022.84 149.122 1022.67 150.096L1010.49 221.091C1010.07 223.542 1012.65 225.41 1014.85 224.253L1078.6 190.734C1079.48 190.274 1080.52 190.274 1081.4 190.734L1145.15 224.253C1147.35 225.41 1149.93 223.542 1149.51 221.091L1137.33 150.096C1137.16 149.122 1137.49 148.129 1138.19 147.44L1189.77 97.1609C1191.55 95.4253 1190.57 92.4014 1188.11 92.0439L1116.83 81.6858C1115.85 81.5438 1115.01 80.9301 1114.57 80.0447L1082.69 15.451Z" fill="#FF0000"/>
            </svg>
          </div>
          <p class="text-white w-full font-['Roboto'] text-balance whitespace-pre-wrap">` + content + `</p>
        </div>`;

  const starsRect = template.content.querySelector("svg > .stars-rect");
  const translate = 100 - (rating / 5) * 100;
  starsRect.style.transform = "translateX(-" + translate + "%)";

  return template.content.firstElementChild;
}

// run the addReviews() function agen if the user chages the selects
const filterStars = document.getElementById("filter-stars");
const sortBy = document.getElementById("sort-by");

filterStars.addEventListener("change", addReviews);
sortBy.addEventListener("change", addReviews);