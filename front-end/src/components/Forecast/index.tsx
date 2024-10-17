import React from "react";
import { Image, Flex, Box, Text } from "@chakra-ui/react";

interface Props {
  weeklyForecast: any[];
}

const Forecast: React.FC<Props> = ({ weeklyForecast }) => {
  console.log("weakly", weeklyForecast);
  return (
    <>
      <Box p="4" className="frost-effect" w="40%" h="fit-content">
        <Text textAlign={"center"} fontSize="sm">
          Next 7 Day Forecast (year-month-date)
        </Text>

        {weeklyForecast.map((forecast, key: any) => {
          return (
            <Box key={key} mt="6">
              <Flex
                w="full"
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Box>
                  <Text fontSize={"sm"}>{forecast.day}</Text>
                  <Text fontSize={"sm"}>{forecast.condition}</Text>
                </Box>
                <Image
                  boxSize="50px"
                  objectFit={"cover"}
                  src={forecast.img}
                ></Image>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  {forecast.temperature} °C
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default Forecast;
