import React, {useState} from 'react';
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack} from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPass, setConfirmPass] = useState();
    const [password, setPassword] = useState();
    const [avatar, setAvatar] = useState();

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast()
    const navigate = useNavigate();
    const showHide = () => setShow(!show)
    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined){
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        console.log(pics)
        if (pics.type==="image/jpeg"  || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "mern-chat");
            data.append("cloud_name", "drkergesl");
            fetch("https://api.cloudinary.com/v1_1/drkergesl/image/upload", {
                method: "post",
                body: data
            })
                .then((res) => res.json())
                .then(data => {
                    //сначала файл отправляется в облако, только после успешного отправления я указываю его ссылку в потенциальном User и разрешаю нажать регистрацию
                    // получается библиотека захламляется файлами, нужно либо придумать авточистку либо защиту от ложного сохранения
                    setAvatar(data.url.toString())
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPass){
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
        if (password !== confirmPass){
            toast({
                title: "Password confirmation failed",
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
                "api/user",
                {name, email, password, avatar},
                config
            );
            toast({
                title: "Registration successful",
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

    // HTML

    return (
        <VStack spacing={'5px'}>
            <FormControl id={'first-name'} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder={'Enter your Name'}
                    onChange={(e)=>setName(e.target.value)}
                />
            </FormControl>
            <FormControl id={'email'} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder={'Enter your Email'}
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id={'password'} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={ show ? "text" : "password" }
                        placeholder={'Enter your Password'}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement w={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={showHide}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id={'confirmPass'} isRequired>
                <FormLabel>Confirm password</FormLabel>
                <InputGroup>
                    <Input
                        type={ show ? "text" : "password" }
                        placeholder={'Confirm your Password'}
                        onChange={(e)=>setConfirmPass(e.target.value)}
                    />
                    <InputRightElement w={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={showHide}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id={'avatar'} isRequired>
                <FormLabel>Upload your avatar</FormLabel>
                <Input
                    type={"file"}
                    p={1.5}
                    accept={"image/*"}
                    onChange={(e)=> postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme={"blue"}
                w={"100%"}
                style={{ marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >Sign Up</Button>
        </VStack>
    );
};

export default Signup;
