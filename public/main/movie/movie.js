window.onload = async () => {
  const moviename = document.querySelector('h1');
  const svgBackground = document.querySelector('#ratingSVG .stars-rect');

  const img = document.querySelector('picture img');
  const imgSource = document.querySelector('picture source');

  const lengthAndRelease = document.querySelector('#movie-length-and-release-date');
  const movieDescription = document.querySelector('#movieDescription');

  const actorSection = document.querySelector('#actorSection');

  const currentURL = window.location.href;

  const reg = /id=([0-9]+)/
  const movieID = currentURL.match(reg)[1];

  const res = await fetch("/movieData?id=" + movieID);
  const list = await res.json();
  const info = list[0];

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
  
}