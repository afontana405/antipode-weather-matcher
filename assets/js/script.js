import { fetchWeatherApi } from 'openmeteo';

async function getCurrentWeather(lat, lon) {
    const params = {
        latitude: lat,
        longitude: lon,
        current: ["temperature_2m", "pressure_msl"],
    };

    try {
        const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", params);
        
        const response = responses[0];
        const current = response.current();
        const temp = current.variables(0).value();
        const pressure = current.variables(1).value();

        console.log('temp:', temp, 'Pressure:', pressure)

        return;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// getCurrentWeather(40, -74)

function generateEarthCoordinates(step = 20) {
    const coordinates = [];
    for (let lat = -90; lat <= 90; lat += step) {
        for (let lon = -180; lon < 180; lon += step) {
            coordinates.push({ lat, lon });
        }
    }
    return coordinates;
}

// Example usage:
const earthCoords = generateEarthCoordinates();
console.log(earthCoords);
console.log(`Total coordinate pairs: ${earthCoords.length}`);