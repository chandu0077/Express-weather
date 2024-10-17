import React, { useState, useEffect } from "react";
import { Image, Icon, Text, Flex, Box } from "@chakra-ui/react";
import axios from "axios";
import { TbUvIndex } from "react-icons/tb";
import { PiWindmillFill } from "react-icons/pi";
import { FaWater } from "react-icons/fa";
import moment from "moment";

interface Props {
  setWeeklyForeCast: Function;
}
type Location = {
  lat: number | null;
  lon: number | null;
};

const Temperature: React.FC<Props> = ({ setWeeklyForeCast }) => {
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [error, setError] = useState<string | null>(null);

  const [weatherData, setWeatherData] = useState<any>();
  const [todayForecast, setTodayForecast] = useState<any[]>();

  const getCurrentTemperature = async (coordinates: string) => {
    const accessToken = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/weather/current?latAndLong=${coordinates}`,
        {
          headers: {
            "auth-token": accessToken,
          },
        },
      );

      const weatherJson = JSON.parse(response.data);
      console.log("weather JSON", weatherJson);
      // we want the next 7hrs of data
      const startTime = moment();
      const endTime = moment().add(7, "hours");
      const todaysHours = weatherJson.forecast.forecastday[0].hour;
      const presentForeCast: any = [];

      // Check the hours that fall into now & next 7hrs and store that data
      for (let todaysHourData of todaysHours) {
        if (
          moment.unix(todaysHourData.time_epoch).isBetween(startTime, endTime)
        ) {
          const data = {
            time: moment(todaysHourData.time_epoch).hour,
            hour: todaysHourData.time.split(" ")[1],
            img: todaysHourData.condition.icon,
            temperature: todaysHourData.temp_c,
          };
          presentForeCast.push(data);
        }
      }

      const weeklyForecast = [];

      for (let forecast of weatherJson.forecast.forecastday) {
        const data = {
          condition: forecast.day.condition.text,
          img: forecast.day.condition.icon,
          temperature: forecast.day.avgtemp_c,
          day: moment.unix(forecast.date_epoch).format("dddd"),
        };
        weeklyForecast.push(data);
      }

      setWeatherData(weatherJson);
      setTodayForecast(presentForeCast);
      setWeeklyForeCast(weeklyForecast);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("///", position);
        const coordinates = `${position.coords.latitude},${position.coords.longitude}`;
        console.log(",,,,", coordinates);
        getCurrentTemperature(coordinates);
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      {error ? (
        <Text color={"black"} fontWeight={"bold"} fontSize={"4xl"}>
          Error Give location access!!!
        </Text>
      ) : (
        weatherData && (
          <Flex direction={"column"} gap="6" w="full">
            <Flex p="6" className="frost-effect" h="fit-content">
              {/* Head block */}
              <Flex
                justifyContent={"space-between"}
                w="full"
                alignItems={"center"}
              >
                <Box>
                  <Text fontSize="4xl" fontWeight={"semibold"}>
                    {weatherData.location.name}
                  </Text>
                  <Text fontSize="sm">{weatherData.location.region}</Text>
                  <Text fontSize="4xl" fontWeight={"semibold"}>
                    {weatherData.current.temp_c} °C
                  </Text>
                </Box>
                <Box>
                  <Image
                    boxSize={"50px"}
                    objectFit={"cover"}
                    src={weatherData.current.condition.icon}
                  />
                </Box>
              </Flex>
            </Flex>

            {/* Today Forecast */}
            {todayForecast && (
              <Box className="frost-effect" p="6">
                <Text fontSize="sm">Today Forecast</Text>
                <Flex
                  mt="4"
                  justifyContent={"space-between"}
                  w="full"
                  alignItems={"center"}
                >
                  {todayForecast?.map((today, idx: number) => {
                    return (
                      <Flex
                        borderRight={
                          idx !== todayForecast.length - 1
                            ? "1px solid white"
                            : "0"
                        }
                        w="100px"
                        alignItems={"center"}
                        direction={"column"}
                      >
                        <Text fontSize="sm">{today.hour}</Text>
                        <Image
                          boxSize="50px"
                          objectFit={"cover"}
                          src={today.img}
                        ></Image>
                        <Text fontSize="sm" fontWeight={"semibold"}>
                          {today.temperature} °C
                        </Text>
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
            )}

            {/* Air Conditions */}
            <Box className="frost-effect" p="6">
              <Text fontSize="sm">Air Conditions</Text>
              <Flex
                mt="4"
                justifyContent={"space-between"}
                w="full"
                alignItems={"center"}
              >
                <Flex w="full" wrap={"wrap"} gap={"2"}>
                  <Box w="48%">
                    <Flex>
                      <Icon color={"black.400"} boxSize="6" as={TbUvIndex} />
                      <Text ml="2" fontSize="sm">
                        UV Index
                      </Text>
                    </Flex>
                    <Text fontSize="xl" ml="6">
                      {weatherData.current.uv}
                    </Text>
                  </Box>
                  <Box w="48%">
                    <Flex>
                      <Icon color={"black.400"} mt="1" as={FaWater} />
                      <Text ml="2" fontSize="sm">
                        Humidity
                      </Text>
                    </Flex>
                    <Text fontSize="xl" ml="6">
                      {weatherData.current.humidity}
                    </Text>
                  </Box>
                  <Box w="48%">
                    <Flex>
                      <Icon
                        color={"black.400"}
                        boxSize="6"
                        as={PiWindmillFill}
                      />
                      <Text ml="2" fontSize="sm">
                        Wind Speed
                      </Text>
                    </Flex>
                    <Text fontSize="xl" ml="6">
                      {weatherData.current.wind_kph} km/h
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        )
      )}
    </>
  );
};

export default Temperature;
