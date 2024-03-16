import { useEffect, useState } from "react";
import { Heading, Container, Text } from "@chakra-ui/react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Profile = () => {
  const api = useAxiosPrivate();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api
      .get("/api/user/profile")
      .then(({ data }) => {
        setInfo(data);
      })
      .catch((error) => {
        setInfo(null);
        console.error(error);
      });
  }, []);

  return (
    <Container>
      <Heading as="h4" size="lg">
        User Profile
      </Heading>

      {info ? (
        <>
          <Text>Name: {info.name}</Text>
          <Text>Email: {info.email}</Text>
        </>
      ) : (
        "loading"
      )}
    </Container>
  );
};

export default Profile;
