import React, {useState} from 'react';
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();
    const showHide = () => setShow(!show)
    const submitHandler = async () => {
        setLoading(true);
        if ( !email || !password){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const {data} = await axios.post(
                "api/user/login",
                {email, password},
                config
            );
            toast({
                title: "Login successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats')
        } catch (error) {
            toast({
                title: "Error",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    //HTML
    return (
        <VStack spacing={'5px'}>
            <FormControl id={'login-email'} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder={'Enter your Email'}
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id={'login-password'} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={ show ? "text" : "password" }
                        placeholder={'Enter your Password'}
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement w={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={showHide}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme={"blue"}
                w={"100%"}
                style={{ marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >Login</Button>
            <Button
                variant={"solid"}
                colorScheme={"purple"}
                w={"100%"}
                onClick={()=>{
                    setEmail('test@test.com');
                    setPassword('123123')
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
