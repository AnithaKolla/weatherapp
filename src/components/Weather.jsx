import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Weather.css';
import search_icon from '../images/search.png';
import clear_icon from '../images/clear.png';
import cloud_icon from '../images/cloud.png';
import drizzle_icon from '../images/drizzle.png';
import rain_icon from '../images/rain.png';
import snow_icon from '../images/snow.png';
import humidity_icon from '../images/humidity.png';
import wind_icon from '../images/wind.png';
import not_found_icon from '../images/not_found.webp';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);
    const [error, setError] = useState(false);
    const [notification, setNotification] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const allIcons = {
        '01d': clear_icon,
        '01n': clear_icon,
        '02d': cloud_icon,
        '02n': cloud_icon,
        '03d': cloud_icon,
        '03n': cloud_icon,
        '04d': drizzle_icon,
        '04n': drizzle_icon,
        '09d': rain_icon,
        '09n': rain_icon,
        '10d': rain_icon,
        '10n': rain_icon,
        '13d': snow_icon,
        '13n': snow_icon,
    };

    const search = (city) => {
        setError(false);
        if (city === '') {
            showNotification('⚠️ Please enter a city name.');
            return;
        }
        
        const apiKey = process.env.REACT_APP_ID;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        axios.get(url)
            .then((response) => {
                const data = response.data;
                const icon = allIcons[data.weather[0].icon] || clear_icon;
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: icon,
                });
                inputRef.current.value = '';
            })
            .catch((error) => {
                setWeatherData(false);
                setError(true);
                console.error('Error fetching weather data:', error);
            });
    };

    useEffect(() => {
        search('Hyderabad');
    }, []);

    const showNotification = (message) => {
        setNotification(message);
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
            setNotification('');
        }, 3000);
    };

    const goBack = () => {
        setError(false);
        search('Hyderabad');  // Reload the default weather data
    };

    return (
        <div className="weather">
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search" />
                <img src={search_icon} alt="search_icon" onClick={() => search(inputRef.current.value)} />
            </div>

            {isVisible && (
                <div className="notification-popup">
                    <p>{notification}</p>
                </div>
            )}

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="weather" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°c</p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="icon" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="icon" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : error ? (
                <div className="error">
                    <img src={not_found_icon} alt="not found" className="error-icon" />
                    <p className="error-message">City Not Found</p>
                    <button onClick={goBack} className="go-back-button">Go Back</button>
                </div>
            ) : null}
        </div>
    );
};

export default Weather;
