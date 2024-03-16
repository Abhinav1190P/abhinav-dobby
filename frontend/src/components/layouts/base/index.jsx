import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Header from "./Header";
import { APPBAR_DESKTOP, APPBAR_MOBILE } from "../../../components/data/constrain";

const MainStyle = (props) => (
  <Box
    as="main"
    flexGrow={1}
    overflow="auto"
    minHeight={`calc(100vh - ${APPBAR_DESKTOP + 1}px)`}
    paddingBottom="10"
    paddingLeft="2"
    paddingRight="2"
    paddingTop={{ lg: `${APPBAR_DESKTOP + 20}px` }}
    {...props}
  />
);

const BaseLayout = ({ children }) => {
  return (
    <>
      <Header />
      <MainStyle>{children || <Outlet />}</MainStyle>
    </>
  );
};

export default BaseLayout;
