import { isNumber } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const weatherForm = document.getElementById("weather-form");
    const weatherButton = document.getElementById("weather-button");

    const getWeather = (lat, lon) => {
        if (!lat || !lon) {
            return console.log("Please provide latitude and longitude");
        }

        const latitude = parseInt(lat);
        const longitude = parseInt(lon);

        fetch(`http://localhost:8080/weather?lat=${latitude}&lon=${longitude}`)
            .then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        return console.log(data.error);
                    }

                    const {
                        name,
                        weather,
                        wind: { speed },
                        main: { feels_like, humidity, pressure, temp },
                        sys: { country },
                    } = data;

                    const weatherData = {
                        name: name || "Unknown",
                        country: country || "Unknown",
                        temperature: temp,
                        description: weather[0].description,
                        "feels-like": feels_like,
                        humidity,
                        pressure,
                        wind: speed,
                    };

                    const weatherInfo = document.getElementById("weather-info");

                    for (const key in weatherData) {
                        if (weatherData.hasOwnProperty(key)) {
                            const spanElement = weatherInfo.querySelector(
                                `.${key}`
                            );

                            if (spanElement) {
                                spanElement.innerText = "";
                                spanElement.innerText =
                                    weatherData[key] + spanElement.innerText;
                            }
                        }
                    }

                    weatherInfo.classList.add("-show");
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                weatherButton.removeAttribute("disabled");
                weatherButton.innerText = "Get Weather";
            });
    };

    const checkFields = () => {
        let allFilled = true;
        const inputs = weatherForm.querySelectorAll('input[type="text"]');

        inputs.forEach((input) => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (allFilled) {
            weatherButton.removeAttribute("disabled");
        } else {
            weatherButton.setAttribute("disabled", "disabled");
        }
    };

    weatherForm.addEventListener("input", checkFields);

    weatherForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        weatherButton.setAttribute("disabled", "disabled");
        weatherButton.innerText = "Loading...";

        const formData = new FormData(evt.target);
        const formProps = Object.fromEntries(formData);
        const { lat, lon } = formProps;

        if (
            !lat ||
            !lon ||
            lat.trim() === "" ||
            lon.trim() === "" ||
            !isNumber(lat) ||
            !isNumber(lon)
        ) {
            window.alert("Please provide valid latitude and longitude!");
            weatherButton.removeAttribute("disabled");
            weatherButton.innerText = "Get Weather";
            return;
        }

        getWeather(lat, lon);
    });
});
