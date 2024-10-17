require("dotenv").config();

const request = require("request");

const getCurrentWeather = async (req, res) => {
  try {
    const latAndLong = req.query.latAndLong;
    const url = `${process.env.WEATHER_API}?key=${process.env.WEATHER_API_KEY}&q=${latAndLong}&days=${process.env.WEATHER_FORECAST_DAYS}`;
    request(url, function (error, response, body) {
      if (error) {
        throw new Error(error);
      } else {
        res.status(200).json(body);
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { getCurrentWeather };
