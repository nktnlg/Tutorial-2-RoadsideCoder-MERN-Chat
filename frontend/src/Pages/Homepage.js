import React, {useEffect} from 'react';
import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user) navigate("/chats")
    }, [navigate]);

    //HTML
    return (
        <Container maxW='xl' centerContent>
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg={"white"}
                w="100%"
                m={"40px 0 15px 0"}
                borderRadius={"lg"}
                borderWidth={'1px'}
            >
                <Text
                    fontSize={"4xl"} fontFamily={'Work sans'}
                >MERN CHAT</Text>
            </Box>
            <Box
                bg={"white"}
                w="100%"
                p={4}
                borderRadius={"lg"}
                borderWidth={'1px'}
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb={"1em"}>
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default Homepage;
