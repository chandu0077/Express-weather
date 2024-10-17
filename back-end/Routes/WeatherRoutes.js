const express = require("express");
const verify = require("../middleware/privateRoute");
const router = express.Router();

const { getCurrentWeather } = require("../Controller/weather");

router.get("/current", verify, getCurrentWeather);

module.exports = router;
