// default cities shown on the homepage
const DEFAULT_CITIES = [
    {id: "los-angeles", name: "Los Angeles", tz: "America/Los_Angeles"},
    { id: "paris",       name: "Paris",       tz: "Europe/Paris" },
    { id: "sydney",      name: "Sydney",      tz: "Australia/Sydney" },
];

function formatDate(m) {
    return m.format("MMMM Do YYYY");
}

function formatTime(m) {
    return `${m.format("h:mm:ss")} <small>${m.format("A")}</small>`;
}


// update all three cities
function updateTime() {
    DEFAULT_CITIES.forEach(({ id, tz}) => {
        const el = document.querySelector(`#${id}`);
        if(!el) return;
        const now = moment().tz(tz);
        el.querySelector(".date").innerHTML = formatDate(now);
        el.querySelector(".time").innerHTML = formatTime(now);
    });
}

function updateCity(event) {
  let cityTimeZone = event.target.value;

  // rest: show default three cities
  if (!cityTimeZone) {
    renderDefaultCities();
    return;
  }

  let isCurrent = cityTimeZone === "current";
  if (isCurrent) {
    cityTimeZone = moment.tz.guess();
  }

  const parts = cityTimeZone.split("/");
  const cityName = parts[parts.length - 1].replace(/_/g, " ");
  const cityTime = moment().tz(cityTimeZone);

  // link back to homepage when showing a selected city
  const homepageLink = `<a class="back-home" href="index.html">← Back to World Clock</a>`;

  // badxeg shown only fo rmy current location
  const badge = isCurrent
    ? `<span class="location-badge">📍 Your location</span>`
    : "";

  document.querySelector("#cities").innerHTML = `
    <div class="city" id="selected-city">
      <div class="city-info">
        <h2>${cityName}</h2>
        <div class="date">${formatDate(cityTime)}</div>
        ${badge}
        ${homepageLink}
      </div>
      <div class="time">${formatTime(cityTime)}</div>
    </div>
  `;

   // Keep the selected city's clock ticking
  clearInterval(window._selectedInterval);
  window._selectedInterval = setInterval(() => {
    const el = document.querySelector("#selected-city");
    if (!el) return;
    const now = moment().tz(cityTimeZone);
    el.querySelector(".date").innerHTML = formatDate(now);
    el.querySelector(".time").innerHTML = formatTime(now);
  }, 1000);
}

 // Restore the three default city cards
function renderDefaultCities() {
  clearInterval(window._selectedInterval);
 
  document.querySelector("#cities").innerHTML = DEFAULT_CITIES.map(
    ({ id, name }) => `
    <div class="city" id="${id}">
      <div class="city-info">
        <h2>${name}</h2>
        <div class="date"></div>
      </div>
      <div class="time"></div>
    </div>`
  ).join("");
 
  updateTime(); // fill times immediately
}

updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);