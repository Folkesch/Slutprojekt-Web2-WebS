window.onload = async () => {

  // Call get recommendedMovies and use the return data to add the movies to the home page
  const res = await fetch("/recommendedMovies");
  const list = await res.json();

  
  const RecommendMainIMG = document.querySelector('#movie-recommend-main img');
  const Recommendmainspan = document.querySelector('#movie-recommend-main span');
  const Recommendmain = document.querySelector('#movie-recommend-main');
  const RecommendSvgBg = document.querySelector("#movie-recommend-main .stars-rect");

  RecommendMainIMG.src = "/image/movies/" + list[0].movieID + "/b.webp";
  Recommendmainspan.innerHTML = list[0].movieTitel;
  Recommendmain.onclick = () => { window.location.href = "/html/movie.html?id=" + list[0].movieID; }

  if (list[0].scoreCount != 0)
  {
    const translate = 100 - ((list[0].scoreSum / list[0].scoreCount) / 5) * 100
    RecommendSvgBg.style.transform = "translateX(-" + translate + "%)"
  }
  else
  {
    RecommendSvgBg.style.transform = "translateX(-100%)"
  }
  
  const MovieRecommendListdivs = document.querySelectorAll('#movie-recommend-movie-list > div');

  for (let i = 0; i < 6; i++)
  {
    const img = MovieRecommendListdivs[i].querySelector("img");
    const source = MovieRecommendListdivs[i].querySelector("source");
    const span = MovieRecommendListdivs[i].querySelector("span");
    const svgBg = MovieRecommendListdivs[i].querySelector(".stars-rect");

    img.src = "/image/movies/" + list[i+1].movieID + "/v.webp";
    source.srcset = "/image/movies/" + list[i+1].movieID + "/s.webp";
    span.innerHTML = list[i+1].movieTitel;
    MovieRecommendListdivs[i].onclick = () => { window.location.href = "/html/movie.html?id=" + list[i+1].movieID;};

    if (list[i+1].scoreCount != 0)
    {
      const translate = 100 - ((list[i+1].scoreSum / list[i+1].scoreCount) / 5) * 100
      svgBg.style.transform = "translateX(-" + translate + "%)"
    }
    else
    {
      svgBg.style.transform = "translateX(-100%)"
    }
  }
}