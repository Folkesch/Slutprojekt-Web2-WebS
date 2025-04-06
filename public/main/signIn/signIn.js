window.onload = async () => {

  // if the user is alredy loged in remove averyting and ony display a log out button 

  const res = await fetch("/username", {
    method: "GET",
    credentials: "include"
  })

  console.log(await res.text());

  if (res.status == 200)
  {
    const main = document.querySelector("main");
    main.innerHTML = `
    <button onclick="LogOut()" class="text-white bg-[var(--darkLight-blue)] w-full py-3 rounded-xl my-3 hover:cursor-pointer hover:bg-[var(--lightLight-blue)]">
      Log out
    </button>
    `
  }
}

// on LogOut button click call post LogOut to remove cookies
async function LogOut() {

  console.log("log out");

  const res = await fetch("/LogOut", {
    method: "POST",
    credentials: "include"
  });

  console.log(await res.text());

  window.location = "/html/signIn.html";
}

// on SignUpp button click create an account, log in to the account and reload the page
async function SignUpp() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  if (username == "" || password == "") return;

  const res = await fetch("/createAccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username: username, password: password }),
  });

  const text = await res.text();

  console.log(res.status, text);
  if (res.status == 200)
  {
    const res2 = await fetch("/LogIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    });
  
    const text2 = await res2.text();
  
    console.log(res2.status, text2);
  
    window.location = "/html/signIn.html";
  }
  else
  {
    const warning = document.querySelector("main span");
    warning.innerHTML = text;
  }
}
// on LogIn button click call post LogIn to add cookies
async function LogIn() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  if (username == "" || password == "") return;

  console.log(username, password);

  const res = await fetch("/LogIn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username: username, password: password }),
  });

  const text = await res.text();

  console.log(res.status, text);

  if (res.status == 200)
  {
    window.location = "/html/signIn.html";
  }
  else
  {
    const warning = document.querySelector("main span");
    warning.innerHTML = text;
  }

}