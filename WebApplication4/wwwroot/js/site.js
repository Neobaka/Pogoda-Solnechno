const API_KEY = 'f424cd597aa650f42de54a20d167d6d5';
let map = null;
const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '🌨️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️',
    'Mist': '🌫️'
};

class WeatherApp {
    constructor() {
        this.weatherWidgets = document.getElementById('weatherWidgets');
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('getWeatherBtn').addEventListener('click', () => this.handleCityWeather());
        document.getElementById('getWeather').addEventListener('click', () => this.handleCoordinatesWeather());
    }

    async fetchWeatherData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка получения данных');
            return await response.json();
        } catch (error) {
            throw new Error('Не удалось получить данные о погоде');
        }
    }

    async handleCityWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();

        if (!city) {
            alert('Пожалуйста, введите название города');
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
            const data = await this.fetchWeatherData(url);
            this.createWeatherWidget(data);
            cityInput.value = '';
        } catch (error) {
            alert(error.message);
        }
    }

    createWeatherWidget(data) {
        const widget = document.createElement('div');
        widget.className = 'weather-widget';

        const mainWeather = data.weather[0].main;
        const icon = weatherIcons[mainWeather] || '❓';

        widget.innerHTML = `
                        <h3>${data.name}, ${data.sys.country}</h3>
                        <div style="font-size: 2em;">${icon}</div>
                        <p>Температура: ${Math.round(data.main.temp)}°C</p>
                        <p>Ощущается как: ${Math.round(data.main.feels_like)}°C</p>
                        <p>Влажность: ${data.main.humidity}%</p>
                        <p>Ветер: ${data.wind.speed} м/с</p>
                        <button class="delete-btn" onclick="this.parentElement.remove()">Удалить</button>
                    `;

        this.weatherWidgets.appendChild(widget);
    }

    async handleCoordinatesWeather() {
        const lat = document.getElementById('latitude').value;
        const lon = document.getElementById('longitude').value;

        if (!this.validateCoordinates(lat, lon)) {
            alert('Пожалуйста, введите корректные координаты');
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
            const data = await this.fetchWeatherData(url);
            this.displayWeatherInfo(data);
            this.updateMap(lat, lon, data.name);
        } catch (error) {
            alert(error.message);
        }
    }

    validateCoordinates(lat, lon) {
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        return !isNaN(latNum) && !isNaN(lonNum) &&
            latNum >= -90 && latNum <= 90 &&
            lonNum >= -180 && lonNum <= 180;
    }

    displayWeatherInfo(data) {
        const mainWeather = data.weather[0].main;
        const icon = weatherIcons[mainWeather] || '❓';

        document.getElementById('weatherInfo').innerHTML = `
                        <div class="weather-widget">
                            <h2>${data.name}</h2>
                            <div style="font-size: 2em;">${icon}</div>
                            <p>Температура: ${Math.round(data.main.temp)}°C</p>
                            <p>Ощущается как: ${Math.round(data.main.feels_like)}°C</p>
                            <p>Влажность: ${data.main.humidity}%</p>
                            <p>Ветер: ${data.wind.speed} м/с</p>
                        </div>
                    `;
    }

    updateMap(lat, lon, locationName) {
        if (map) {
            map.remove();
        }

        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(locationName)
            .openPopup();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});