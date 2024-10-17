"use client";
import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProfileBlock from "@/components/ProfileBlock";
const Profile = ({}) => {
  const [userData, setUserData] = useState<any>();
  const getUserData = async () => {
    const acccessToken = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/user/", {
        headers: {
          "auth-token": acccessToken,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Flex
        maxW="1240px"
        mx="auto"
        my="12"
        gap={4}
        justifyContent={"space-between"}
      >
        <Sidebar />
        <ProfileBlock userData={userData} />
      </Flex>
    </>
  );
};
export default Profile;
