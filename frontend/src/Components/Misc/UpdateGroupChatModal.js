import React, {useState} from 'react';
import {
    Box, Button,
    FormControl, IconButton, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Spinner,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {ViewIcon} from "@chakra-ui/icons";
import {ChatState} from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const {selectedChat, setSelectedChat, user} = ChatState();

    const handleAddUser = async (addedUser) => {
        if(selectedChat.users.find(u => u._id === addedUser._id)){
            toast({
                title: "User already in the group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admin can add to group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try{
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.patch('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: addedUser._id
            }, config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch(error) {
            toast({
                title: "Error occurred",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }

    }

    const handleRemove = async (removedUser) => {

        if (selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admin can remove from group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try{
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.patch('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: removedUser._id
            }, config)

            removedUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch(error) {
            toast({
                title: "Error occurred",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if(!groupChatName) return;

        try{
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.patch('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            console.log(data._id);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch(error) {
            toast({
                title: "Error occurred",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query) {
            return;
        }
        try{
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false);
            setSearchResult(data);
        } catch(error) {
            toast({
                title: "Error occurred",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            setLoading(false);
        }
    };

    //HTML
    return (
        <>
            <IconButton
                display={"flex"}
                icon={<ViewIcon/>}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                    >
                        <Box
                            w={"100%"}
                            display={"flex"}
                            flexWrap={"wrap"}
                            pb={3}
                        >
                            {selectedChat.users.map((u)=>(
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl display={"flex"}>
                            <Input
                                placeholder={"Chat Name"}
                                mb={3}
                                value={groupChatName}
                                onChange={(e)=>setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant={"solid"}
                                colorScheme={"teal"}
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder={"Add Users to group"}
                                mb={1}
                                onChange={(e)=>handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ?
                            (<Spinner size={"lg"}/>):
                            (searchResult?.map((u)=>(
                                <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={()=> handleAddUser(u)}
                                />)))
                        }

                        <Box
                            w="100%"
                            display={"flex"}
                            flexWrap={"wrap"}
                        >

                        </Box>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='red'
                            mr={3}
                            onClick={()=>handleRemove(user)}
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
