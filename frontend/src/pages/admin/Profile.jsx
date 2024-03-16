import { useEffect, useState } from "react";
import { Text, Container } from "@chakra-ui/react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Profile = () => {
  const api = useAxiosPrivate();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/profile")
      .then(({ data }) => {
        setInfo(data);
      })
      .catch((error) => {
        setInfo(null);
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <Text as="h4" size="lg">Admin Profile</Text>

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
