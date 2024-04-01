const request = require("postman-request");
const util = require("util");

const promisifiedRequest = util.promisify(request);

const getWeather = async ({ lat = 44.34, lon = 10.99 }) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;

    try {
        const response = await promisifiedRequest({ url, json: true });

        if (
            parseInt(response.body.cod) >= 400 &&
            parseInt(response.body.cod) < 511
        ) {
            throw new Error("Something went wrong!");
        }

        return response.body;
    } catch (err) {
        throw new Error("Unable to connect to weather service!");
    }
};

module.exports = {
    getWeather,
};
