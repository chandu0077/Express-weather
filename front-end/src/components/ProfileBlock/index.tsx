import React from "react";
import {
  Button,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { userForm } from "@/utilis/forms/userForm";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IUserData {
  name: string;
  email: string;
  password: string;
}

interface Props {
  userData: IUserData;
}

const ProfileBlock: React.FC<Props> = ({ userData }) => {
  const router = useRouter();
  const values = userData;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userForm),
    criteriaMode: "firstError",
    values: values,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  type IUserForm = yup.InferType<typeof userForm>;

  const onSubmit = (data: IUserForm) => {
    const accessToken = localStorage.getItem("token");

    axios
      .put(`http://localhost:5000/api/user/${data._id}/update`, data, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": accessToken,
        },
      })
      .then(function (response: any) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        router.push("/weather");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Flex direction={"column"} gap="6" w="full">
        <Flex p="6" className="frost-effect" h="fit-content">
          {/* Head block */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={getValues(`name`)}
                onChange={(e) => {
                  setValue("name", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <Text>{errors?.name?.message}</Text>
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input disabled type="email" value={getValues(`email`)} />
              <Text>{errors?.email?.message}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => {
                  setValue("password", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <Text>{errors?.password?.message}</Text>
            </FormControl>

            <Button
              mt="4"
              backgroundColor="black"
              color="white"
              px="12"
              py="6"
              borderRadius="14px"
              type="submit"
            >
              Update
            </Button>
          </form>
        </Flex>
      </Flex>
    </>
  );
};

export default ProfileBlock;
