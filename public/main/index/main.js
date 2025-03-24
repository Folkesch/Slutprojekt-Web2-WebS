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