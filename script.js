document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById("city-input");
  const getweatherbtn = document.getElementById("get-weather-btn");
  const weatherinfo = document.getElementById("weather-info");
  const cityName = document.getElementById("city-name");
  const temp = document.getElementById("temperature");
  const desc = document.getElementById("description");
  const icon = document.getElementById("icon");
  const appDate = document.querySelector(".app-date");
  const feelsLike = document.getElementById("feels-like");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const error = document.getElementById("error-message");

  const API_KEY = "3abc2a0c328103686081e20eeb49102a";

  function updateDate() {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    appDate.textContent = today.toLocaleDateString('en-US', options);
  }

  getweatherbtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) return;
    try {
      const weatherData = await fetchWeatherdata(city);
      displayweatherdata(weatherData);
    } catch (error) {
      showError();
    }
  });

  cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      getweatherbtn.click();
    }
  });

  async function fetchWeatherdata(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("city not found");
    }
    const data = await response.json();
    return data;
  }

  function displayweatherdata(data) {
    const { name, main, weather, wind } = data;
    cityName.textContent = name;
    temp.textContent = `${Math.round(main.temp)}°`;
    desc.textContent = weather[0].description;
    icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    feelsLike.textContent = `${Math.round(main.feels_like)}°`;
    humidity.textContent = `${main.humidity}%`;
    windSpeed.textContent = `${(wind.speed * 3.6).toFixed(2)} km/h`;

    updateDate();

    const weatherMain = (weather && weather[0] && weather[0].main) ? weather[0].main.toLowerCase() : '';
    document.body.className = '';

    if (weatherMain.includes('rain') || weatherMain.includes('drizzle') || weatherMain.includes('thunderstorm')) {
      document.body.classList.add('rainy');
    } else if (weatherMain.includes('clear') || weatherMain.includes('sun')) {
      document.body.classList.add('sunny');
    } else if (weatherMain.includes('clouds')) {
      document.body.classList.add('cloudy');
    } else if (weatherMain.includes('mist') || weatherMain.includes('haze') || weatherMain.includes('fog') || weatherMain.includes('smoke')) {
      document.body.classList.add('misty');
    } else if (weatherMain.includes('snow')) {
      document.body.classList.add('snowy');
    } else {
      document.body.classList.add('cloudy');
    }

    weatherinfo.classList.remove("hidden");
    error.classList.add("hidden");
  }

  function showError() {
    weatherinfo.classList.add('hidden');
    error.classList.remove('hidden');
    error.textContent = "City not found. Please try again.";
  }

  // Quick city chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      cityInput.value = chip.textContent;
      getweatherbtn.click();
    });
  });
});
