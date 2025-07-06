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

// Function to loop through coordinates array and fetch weather data
async function fetchWeatherForAllCoordinates(coordinates) {
    const weatherDataPromises = coordinates.map(async (coord) => {
        const { lat, lon } = coord;
        const weather = await getCurrentWeather(lat, lon);
        return weather;
    });

    // Wait for all weather data to be fetched
    const weatherResults = await Promise.all(weatherDataPromises);

    // Output weather data for all coordinates
    console.log(weatherResults);
}

function generateEarthCoordinates(step = 40) {
    const coordinates = [];
    for (let lat = -90; lat <= 90; lat += step) {
        for (let lon = -180; lon < 180; lon += step) {
            coordinates.push({ lat, lon });
        }
    }
    return coordinates;
}

const coordinates = generateEarthCoordinates();

fetchWeatherForAllCoordinates(coordinates);