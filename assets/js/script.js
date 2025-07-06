import { fetchWeatherApi } from 'openmeteo';

const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);