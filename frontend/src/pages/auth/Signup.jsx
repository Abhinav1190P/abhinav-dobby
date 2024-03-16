import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Link as RouteLink } from "react-router-dom";
import {
  Link,
  Box,
  Container,
  Input,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormErrorMessage,
} from "@chakra-ui/react";
import PageTitle from "../../components/typography/PageTitle";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import { catchError } from "../../utils/catchError";
import usePageTitle from "../../hooks/usePageTitle";
import Flexbox from "../../components/typography/Flexbox";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
  userName: z
    .string()
    .regex(/^\S*$/, "Space not allowed")
    .min(5, "Username minimum 5 characters")
    .max(20, "Username maximum 20 characters"),
  password: z.string().min(6, "Password minimum 6 characters"),
  role: z.enum(["user", "admin"]),
});

const defaultValues = {
  name: "",
  email: "",
  userName: "",
  password: "",
  role: "user",
};

const Signup = () => {
  usePageTitle("Create account");
  const [submitting, setSubmitting] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    setSubmitting(true);

    const response = axios.post("/api/auth/signup", data);

    toast.promise(response, {
      loading: "Saving...",
      success: ({ data }) => {
        reset(defaultValues);
        return data.message;
      },
      error: (error) => {
        setSubmitting(false);
        return catchError(error);
      },
    });
  };

  return (
    <Container maxWidth="md" py="1rem">
      <PageTitle mb="2" title="Create an Account" />

      <Box p="4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl isInvalid={!!errors.name} mb="4">
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input {...field} autoFocus />
                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl isInvalid={!!errors.email} mb="4">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input {...field} />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="userName"
            render={({ field }) => (
              <FormControl isInvalid={!!errors.userName} mb="4">
                <FormLabel htmlFor="userName">Username</FormLabel>
                <Input {...field} />
                <FormErrorMessage>{errors?.userName?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl isInvalid={!!errors.password} mb="4">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input {...field} type="password" />
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <Flexbox justifyContent="flex-start" alignItems="center" mb="4">
            <FormLabel>Role</FormLabel>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <Radio value="user">User</Radio>
                  <Radio value="admin">Admin</Radio>
                </RadioGroup>
              )}
            />
          </Flexbox>

          <Button
            type="submit"
            variant="solid"
            colorScheme="primary"
            isLoading={submitting}
            mb="4"
          >
            Create Account
          </Button>
        </form>
      </Box>

      <Link as={RouteLink} to="/login" mt="2" textAlign="right" fontSize="sm" display="block">
        Already have an account? Sign in
      </Link>
    </Container>
  );
};

export default Signup;
