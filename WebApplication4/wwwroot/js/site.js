const API_KEY = 'f424cd597aa650f42de54a20d167d6d5'; // Замените на ваш ключ API
const weatherDisplay = document.getElementById('weatherDisplay');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');

const fetchWeather = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('Город не найден');
    }
    return response.json();
};

const displayWeather = (data) => {
    const { name, main: { temp }, weather } = data;
    const weatherDescription = weather[0].description;
    const icon = getWeatherIcon(weatherDescription);
    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <p>Температура: ${temp} °C</p>
        <p>Описание: ${weatherDescription}</p>
        <img src="${icon}" alt="${weatherDescription}">
    `;
};

const getWeatherIcon = (description) => {
    if (description.includes('clear')) return 'sunny.png'; 
    if (description.includes('rain')) return 'rainy.png'; 
    return 'img/cloudy.png'; 
};

const handleWeatherRequest = async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Пожалуйста, введите город');
        return;
    }
    try {
        const weatherData = await fetchWeather(city);
        displayWeather(weatherData);
    } catch (error) {
        alert(error.message);
    }
};

getWeatherBtn.addEventListener('click', handleWeatherRequest);