// On chope tous les id des éléments qu'on va modifier en JS

var time_html = document.getElementById("time");
var title_html = document.getElementById("music");
var fullscreen_button_html = document.getElementById("fullscreen");
var page_html = document.documentElement;
var settings_html = document.getElementById("settings");
var screen_front_html = document.getElementById("screen_front");
var news_html = document.getElementById("quote");
var duino_html = document.getElementById("duino");
var weather_html = document.getElementById("weather");

function setCookie(cvalues, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cvalues + "; " + expires + "; path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function getNews() {
  const url =
    "https://news-api14.p.rapidapi.com/top-headlines?country=fr&language=fr&pageSize=20";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "1b31b8f50cmsh5a26af0ad47b4e0p13cb2ejsn1e495e1ecbf8",
      "X-RapidAPI-Host": "news-api14.p.rapidapi.com",
    },
  };

  let response = await fetch(url, options);
  let data = await response.json();
  return data;
}

async function getWeather() {
  let response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=8fdaebc1c5f040d39d2178f811adfeaa"
  );
  let data = await response.json();
  return data;
}

async function getDuino() {
  let response = await fetch("https://server.duinocoin.com/users/marsisus");
  let data = await response.json();
  return data;
}

async function getTitle() {
  let response = await fetch(
    "https://ws.audioscrobbler.com/2.0?api_key=b3b84fbb83102133b41c34cf82000a7d&method=user.getRecentTracks&limit=1&format=json&user=marsisus"
  );
  let data = await response.json();
  return data;
}

function openFullscreen() {
  if (!document.fullscreenElement) {
    fullscreen_button_html.innerHTML = `<i class="bi bi-fullscreen-exit"></i>`;
    if (page_html.requestFullscreen) {
      page_html.requestFullscreen();
    } else if (page_html.webkitRequestFullscreen) {
      /* Safari */
      page_html.webkitRequestFullscreen();
    } else if (page_html.msRequestFullscreen) {
      /* IE11 */
      page_html.msRequestFullscreen();
    }
  } else {
    fullscreen_button_html.innerHTML = `<i class="bi bi-fullscreen"></i>`;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  }
}

function openSettings() {
  screen_front_html.style.display = "block";
  screen_front_html.innerHTML = `<h1>Settings</h1>
  <button id="close" class="btn" onClick="closeSettings()" type="Button"><i class="bi bi-x-lg"></i></button>
  <form id="settings_form" onSubmit="setSettings()">
  <label for="background_image_field">Link to background image :</label>
  <input id="background_image_field" name="background_image" value="${getCookie(
    "background_image"
  )}"/>
  <br/>
  <label for="text_color_field">Text Color : </label>
  <input type="color" class="btn" id="text_color_field" value="${getCookie(
    "text_color"
  )}"name="text_color">
  <br/>
  <input type="submit" class="btn btn-primary" value="Submit" />
</form>`;
}

function setSettings() {
  var new_background_image = document.getElementById(
    "background_image_field"
  ).value;
  var new_text_color = document.getElementById("text_color_field").value;
  var to_cookie = "";
  if (new_background_image) {
    setCookie(`background_image=${new_background_image}`, 1000);
  }
  if (new_text_color) {
    setCookie(`text_color=${new_text_color}`, 1000);
  }

  console.log(to_cookie);
  setCookie(to_cookie, 1000);
}

function closeSettings() {
  screen_front_html.style.display = "none";
  screen_front_html.innerHTML = "";
}

function getIcon(text) {
  if (text == "Thunderstorm") {
    return `<i class="bi bi-cloud-lightning-rain"></i>`;
  } else if (text == "Drizzle") {
    return `<i class="bi bi-cloud-drizzle"></i>`;
  } else if (text == "Rain") {
    return `<i class="bi bi-cloud-rain-heavy"></i>`;
  } else if (text == "Snow") {
    return `<i class="bi bi-cloud-rain-heavy"></i>`;
  } else if (text == "Mist" || text == "Fog" || text == "Dust") {
    return `<i class="bi bi-cloud-fog"></i>`;
  } else if (text == "Clear") {
    return `<i class="bi bi-sun"></i>`;
  } else if (text == "Clouds") {
    return `<i class="bi bi-clouds"></i>`;
  } else {
    return `<i class="bi bi-question-diamond"></i>`;
  }
}

function setNews() {
  news_html.innerHTML = `<a href=${news_titles[news_index][1]} class="link-underline-opacity-0 link-info">${news_titles[news_index][0]}</a>`;
}

function setWeather() {
  getWeather().then((data) => {
    weather_html.innerHTML = `<h5>${getIcon(
      data["weather"][0]["main"]
    )} ${Math.round(data["main"]["temp"] - 273.15)}°C</h5>`;
  });
}

function setDuino() {
  getDuino().then((data) => {
    duino_html.innerHTML = `<a href="https://wallet.duinocoin.com" class="link-underline-opacity-0 link-light"><h5>${Math.round(
      data["result"]["balance"]["balance"]
    )}<img class="icon" src="https://cdn.glitch.global/0452ee77-cf15-4dc3-9eda-fdaf708edf2e/Duino.png?v=1698772180130"/></h5></a>`;
  });
}

function setSong() {
  getTitle().then((data) => {
    try {
      if (data["recenttracks"]["track"][0]["@attr"]["nowplaying"] == "true") {
        title_html.innerHTML = `<h2><i class="bi bi-spotify"></i> ${data["recenttracks"]["track"][0]["name"]}</h2>
      <h3>${data["recenttracks"]["track"][0]["artist"]["#text"]}</h3>`;
      }
    } catch {
      title_html.innerHTML = ``;
    }
  });
}

function initialisation() {
  
  document.body.style.opacity = "0";
  getNews().then((data) => {
    for (let i = 0; i < data["articles"].length; i++) {
      news_titles.push([
        data["articles"][i]["title"],
        data["articles"][i]["url"],
      ]);
    }
    // on ajoute une première actu à liste pour limiter les temps de chargement
    setNews();
  });
  setWeather();
  setDuino();
  setSong();
}
// On chope les cookies, pour l'instant on reset en cas de changement d'ordinateur

var cookie = document.cookie;
if (cookie == "") {
  setCookie("text_color=#f8f9fa", 1000);
  setCookie(
    "background_image=https://cdn.glitch.global/0452ee77-cf15-4dc3-9eda-fdaf708edf2e/milky-way-2695569_1280.jpg?v=1698698162750",
    1000
  );
}
// On met en place ce qu'on a trouvé dans les cookies

document.body.style.backgroundImage = `url("${getCookie(
  "background_image"
)}') ;`;
document.body.style.color = getCookie("text_color");

console.log(document.cookie);

// TOUTES LES FONCTIONS REPETITIVES : Heure, Musique, Actualités, DuinoCoin, Meteo...
let news_titles = [];
let news_index = 0;


initialisation()
document.body.style.opacity= "1"; 
document.body.style.transition= '1sec'

// Changer de page d'actualité toutes les 20 secondes
setInterval(function () {
  setNews();
  news_index++;
  if (news_index >= news_titles.length - 1) {
    news_index = 0;
  }
}, 20000);

setInterval(function () {
  setWeather();
}, 10000);

setInterval(function () {
  setDuino();
}, 10000);

setInterval(function () {
  var now = new Date();
  let minutes = "";
  if (now.getMinutes() < 10) {
    minutes = `0${now.getMinutes()}`;
  } else {
    minutes = `${now.getMinutes()}`;
  }
  time_html.innerHTML = `${now.getHours()}:${minutes}`;
}, 1000);

setInterval(function () {
  setSong();
}, 7500);
