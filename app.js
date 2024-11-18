const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const forecastContainer = document.getElementById("forecast-container");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name!");
  }
});

async function fetchWeather(city) {
  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const currentWeatherRes = await fetch(currentWeatherUrl);
    const currentWeatherData = await currentWeatherRes.json();

    if (currentWeatherRes.ok) {
      displayCurrentWeather(currentWeatherData);

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=7&appid=${API_KEY}`;
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      if (forecastRes.ok) {
        displayForecast(forecastData);
      }
    } else {
      alert("City not found! Please try again.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("An error occurred. Please try again later.");
  }
}

function displayCurrentWeather(data) {
  cityName.innerHTML = `City: <span>${data.name}</span>`;
  temperature.innerHTML = `Temperature: <span>${data.main.temp}</span>°C`;
  humidity.innerHTML = `Humidity: <span>${data.main.humidity}</span>%`;
  windSpeed.innerHTML = `Wind Speed: <span>${(data.wind.speed * 3.6).toFixed(
    1
  )}</span> km/h`;
}

function displayForecast(data) {
  forecastContainer.innerHTML = "";
  data.list.forEach((item) => {
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    forecastItem.innerHTML = `
      <p>${day}</p>
      <img src="${iconUrl}" alt="${item.weather[0].description}">
      <p>${item.main.temp.toFixed(1)}°C</p>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}
