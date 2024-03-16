import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormErrorMessage,
  FormHelperText,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,

  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { catchError } from "../../utils/catchError";
import useAuth from "../../hooks/useAuth";
import usePageTitle from "../../hooks/usePageTitle";
import { Controller, useForm } from "react-hook-form";
import { Link as RouteLink } from "react-router-dom";

const schema = z.object({
  userName: z
    .string()
    .trim()
    .min(5, "Username minimum 5 characters")
    .max(20, "Username maximum 20 characters"),
  password: z
    .string()
    .trim()
    .min(6, "Password should be minimum of 6 characters")
    .max(40, "Must be 40 or fewer characters long"),
});

const defaultValues = {
  userName: "",
  password: "",
};

export default function SignIn() {
  usePageTitle("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.userName, data.password);
    } catch (error) {
      setError(catchError(error));
      setLoading(false);
    }
  };

  return (
    <Container maxW="sm">
      <Box p={3}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Avatar bg="primary.main">
            <LockIcon />
          </Avatar>
          <Text as="h1" fontSize="xl" mt={2}>
            Login
          </Text>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <FormControl id="userName" isInvalid={errors.userName}>
              <FormLabel>Username</FormLabel>
              <Controller
                control={control}
                name="userName"
                render={({ field }) => (
                  <Input
                    autoFocus
                    {...field}
                    type="text"
                  />
                )}
              />
              <FormErrorMessage>{errors.userName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={errors.password} mt={4}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                    />
                  )}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    colorScheme="gray"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={togglePasswordVisibility}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            {error && (
              <FormHelperText color="red" fontSize="sm" mt={2}>
                {error}
              </FormHelperText>
            )}

            <Button
              mt={4}
              colorScheme="primary"
              isLoading={loading}
              type="submit"
              width="100%"
            >
              Login
            </Button>
          </form>

          <ChakraLink as={RouteLink} to="/signup" mt={2} fontSize="sm">
            Don't have an account? Create account
          </ChakraLink>
        </Box>
      </Box>
    </Container>
  );
}
