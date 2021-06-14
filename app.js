const config = {
    appid: "your token openweathermap",
    units: "metric",
    lang: "fr",
};
let city = "";

const elMeteo = document.querySelector("#meteo");
const elName = document.querySelector("#name");
const elTemp = document.querySelector("#temp");
const elOtherInfo = document.querySelector("#otherInfo");
const elImgWeather = document.querySelector("#imgWeather");
const elInput = document.querySelector("#input");
const elBtn = document.querySelector("#btn");

async function apiMeteo() {
    const url = new URL(
        `http://api.openweathermap.org/data/2.5/weather?appid=${config.appid}&units=${config.units}&lang=${config.lang}&q=${city}`
    );
    const meteo = await fetch(url)
        .then((res) => res.json())
        .catch(() => (elOtherInfo.innerHTML = `\nErreur d'API`));

    if (!meteo.name)
        return (elOtherInfo.innerHTML = `Error ${meteo.cod}<br>${meteo.message}`);

    if (meteo.weather[0].icon.includes("n")) {
        elMeteo.classList.add("night");
    } else {
        elMeteo.classList.remove("night");
    }

    const timezone = msConv(meteo.timezone);
    const localTime = parseString(Date.now() + timezone, true);
    const sunrise = parseString(msConv(meteo.sys.sunrise) + timezone);
    const sunset = parseString(msConv(meteo.sys.sunset) + timezone);

    elName.innerHTML = `${meteo.name}, ${meteo.sys.country}`;
    elTemp.innerHTML = `${parseFloat(meteo.main.temp.toFixed(1))}°C`;
    elOtherInfo.innerHTML = `
        ${localTime}<br>
        ${meteo.weather[0].description}<br>
        <br>
        Humidité : ${meteo.main.humidity}% 💦<br>
        Vent : ${meteo.wind.speed.toFixed()}% 💨<br>
        <br>
        Lever du soleil : ${sunrise} ☀️<br>
        Coucher du soleil : ${sunset} 🌑`;
    elImgWeather.src = `http://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png`;
}

function msConv(value) {
    return value * 1000;
}

function parseString(value, weekday = false) {
    const localTimeString = new Date(value).toLocaleString("fr-FR", {
        timeZone: "UTC",
        weekday: weekday ? "long" : undefined,
        hour: "numeric",
        minute: "numeric",
    });
    return localTimeString;
}

elBtn.addEventListener("click", (e) => {
    e.preventDefault();
    city = elInput.value;
    apiMeteo();
});
