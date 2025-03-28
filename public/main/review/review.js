const stars = document.getElementById("ratingSVG");

let starRating = 0;

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