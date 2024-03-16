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
  SimpleGrid,
  useToast,
  GridItem,
  Radio,
  FormErrorMessage,
} from "@chakra-ui/react";
import PageTitle from "../../components/typography/PageTitle";
import axios from "axios";
import { catchError } from "../../utils/catchError";
import usePageTitle from "../../hooks/usePageTitle";

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
  const toast = useToast()
  const onSubmit = async (signupDetails) => {
    setSubmitting(true);
  
    try {
      const { data } = await axios.post("http://localhost:4000/api/auth/signup", signupDetails);
      if (data.success) {
        toast({
          title: 'Account created',
          status: 'success',
          duration: 9000,
          position: 'top',
          isClosable: true,
        });
        reset()
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        toast({
          title: error.response.data.message,
          status: 'error',
          duration: 9000,
          position: 'top',
          isClosable: true,
        });
      } else {
        toast({
          title: "An error occurred.",
          status: 'error',
          duration: 9000,
          position: 'top',
          isClosable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };
  



  return (
    <Container maxWidth="md" py="1rem">
      <PageTitle mb="2" title="Create an Account" />

      <Box p="4">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <SimpleGrid spacingX={5} columns={2} style={{ width: '100%' }}>
            <GridItem colSpan={1} width={'100%'}>
              <Box mb="20px">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.name} mb="4">
                      <Input
                        {...field} autoFocus
                        type="text"
                        placeholder="Name"
                        bgColor="rgba(255, 255, 255, 0.1)"
                        color="#fff"
                        borderRadius="5px"
                        py="10px"
                        px="15px"
                        mb="20px"
                        _focus={{ outline: "none" }}
                      />
                      <FormErrorMessage mt={0} width={'100%'} fontSize={'x-small'}>{errors?.name?.message}</FormErrorMessage>

                    </FormControl>
                  )} />

              </Box>
            </GridItem>
            <GridItem colSpan={1} w={'100%'}>
              <Box mb="20px">
                <Controller
                  control={control}
                  name="userName"
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.userName} mb="4">
                      <Input
                        type="text"
                        placeholder="Username"
                        bgColor="rgba(255, 255, 255, 0.1)"
                        color="#fff"
                        borderRadius="5px"
                        py="10px"
                        px="15px"
                        mb="20px"
                        {...field}
                        _focus={{ outline: "none" }}
                      />
                      <FormErrorMessage mt={0} width={'100%'} fontSize={'x-small'}>{errors?.userName?.message}</FormErrorMessage>

                    </FormControl>
                  )} />
              </Box>
            </GridItem>
            <GridItem colSpan={2} w={'100%'}>
              <Box mb="20px">

                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.email} mb="4">
                      <Input
                        type="email"
                        placeholder="Email"
                        bgColor="rgba(255, 255, 255, 0.1)"
                        color="#fff"
                        borderRadius="5px"
                        py="10px"
                        px="15px"
                        mb="20px"
                        {...field}
                        _focus={{ outline: "none" }}
                      />
                      <FormErrorMessage mt={0} width={'100%'} fontSize={'x-small'}>{errors?.email?.message}</FormErrorMessage>
                    </FormControl>

                  )} />



              </Box>
            </GridItem>
            <GridItem colSpan={2} w={'100%'}>
              <Box mb="20px">

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.password} mb="4">
                      <Input
                        type="password"
                        placeholder="Password"
                        bgColor="rgba(255, 255, 255, 0.1)"
                        color="#fff"
                        borderRadius="5px"
                        py="10px"
                        px="15px"
                        mb="20px"
                        {...field}
                        _focus={{ outline: "none" }}
                      />
                      <FormErrorMessage mt={0} width={'100%'} fontSize={'x-small'}>{errors?.password?.message}</FormErrorMessage>
                    </FormControl>
                  )} />

              </Box>
            </GridItem>

            <GridItem colSpan={1}>
              <Button
                bgColor="#373737"
                color="#fff"
                borderRadius="20px"
                px={10}
                cursor="pointer"
                _hover={{ opacity: .8 }}
                mr={3}
              >
                Change method
              </Button>
            </GridItem>
            <GridItem colSpan={1}>

              <Button
                type="submit"
                bgColor="#1E90F1"
                color="#fff"
                borderRadius="20px"
                px={10}
                cursor="pointer"
                _hover={{ opacity: .8 }}
                boxShadow={'0px 4px 10px rgba(30, 144, 241, 0.5)'} /* Adjust the shadow color and opacity as needed */
              >
                Create account
              </Button>

            </GridItem>
          </SimpleGrid>
        </form>
      </Box>

      <Link as={RouteLink} to="/login" mt="2" textAlign="right" fontSize="sm" display="block">
        Already have an account? Sign in
      </Link>
    </Container>
  );
};

export default Signup;
