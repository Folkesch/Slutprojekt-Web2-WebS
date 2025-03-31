const stars = document.getElementById("ratingSVG");

let starRating = 3;

stars.addEventListener("click", (e) => {
  const offsets = stars.getBoundingClientRect();
  const w = offsets.right - offsets.left;
  //const h = offsets.bottom - offsets.top;

  //const y = e.clientY - offsets.top;
  const x = e.clientX - offsets.left;

  const amountOfStars = Math.floor((x / w) * 5 + 1);

  const starsBg = document.querySelector("#ratingSVG .stars-rect");

  starsBg.style.transform = "translateX(-" + (100 - amountOfStars * 20) + "%)";

  starRating = amountOfStars;
})

window.onload = async () => 
{
  const currentURL = window.location.href;

  const reg = /id=([0-9]+)/
  const movieID = currentURL.match(reg)[1];

  if (movieID)
  {
    const res = await fetch("/movieData?id=" + movieID);

    const movieData = (await res.json())[0];

    const h1 = document.querySelector("h1");

    h1.innerHTML = "Rate " + movieData.movieTitel;
  }

}

async function submit() {

  const currentURL = window.location.href;

  const reg = /id=([0-9]+)/
  const movieID = currentURL.match(reg)[1];

  if (!movieID)
  {
    return;
  }

  const rating = starRating;
  let content = document.getElementById("Description").value;

  if (content == "") 
  {
    content = null;
  }

  console.log(movieID, rating, content);

  const res = await fetch("/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(
    {
      "movieID": movieID,
       "rating": rating,
       "content": content
    })
  });

  document.querySelector("main > span").innerHTML = await res.text();
  document.getElementById("Description").value = "";

}