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

// buffer to prevent "too many concurrent requests" errors from weather api
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to loop through coordinates array with delay to avoid rate limiting
async function fetchWeatherForAllCoordinates(coordinates) {
    const weatherResults = [];

    for (let i = 0; i < coordinates.length; i++) {
        const { lat, lon } = coordinates[i];

        await getCurrentWeather(lat, lon);

        // Wait 500ms between requests; adjust as needed based on Open-Meteo limits
        await delay(500);
    }
}

function generateAntipodePairedCoordinates(step = 40) {
    const coordinates = [];
    const added = new Set();

    // Helper to normalize longitude to [-180, 180)
    const normalizeLon = lon => {
        let l = ((lon + 180) % 360 + 360) % 360 - 180;
        return l === -180 ? 180 : l; // handle edge case if needed
    };

    for (let lat = -90; lat <= 90; lat += step) {
        for (let lon = -180; lon < 180; lon += step) {
            const key = `${lat},${lon}`;
            if (added.has(key)) continue;

            // Add the current coordinate
            coordinates.push({ lat, lon });
            added.add(key);

            // Compute antipode
            const antipodeLat = -lat;
            const antipodeLon = normalizeLon(lon + 180);
            const antipodeKey = `${antipodeLat},${antipodeLon}`;

            // Skip adding antipode if it is already added (avoids duplicates)
            if (!added.has(antipodeKey)) {
                coordinates.push({ lat: antipodeLat, lon: antipodeLon });
                added.add(antipodeKey);
            }
        }
    }

    return coordinates;
}

// Example usage:
const coords = generateAntipodePairedCoordinates();
console.log(fetchWeatherForAllCoordinates(coords))