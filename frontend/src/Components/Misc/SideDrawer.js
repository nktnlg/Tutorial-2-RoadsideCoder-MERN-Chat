import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button, Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList, Spinner,
    Text,
    Tooltip,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import {ChatState} from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import {useNavigate} from "react-router-dom";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import {getSender} from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {user, setSelectedChat, chats, setChats, bell, setBell} = ChatState();

    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    };

    const toast = useToast();
    const handleSearch = async () => {
        if(!search){
            toast({
                title: "Search field empty",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error occurred",
                description: "Failed to Load Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post('/api/chat', {userId}, config)

            if(!chats.find((c) => c._id === data._id))
                setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch(error) {
            toast({
                title: "Error loading Chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }



    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = React.useRef()


    //HTML
    return (
        <div>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            bg={"white"}
            w={"100%"}
            p={"5px 10px 5px 10px"}
            borderWidth={"5px"}
          >
              <Tooltip
                  label={"Search Users to chat"}
                  hasArrow
                  placement={"bottom-end"}
              >
                  <Button variant={"ghost"} ref={btnRef}  onClick={onOpen}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <Text display={{base:"none", md:"flex"}} px={4}>Search User</Text>
                  </Button>
              </Tooltip>

              <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
                  MERN CHAT
              </Text>

              <div>
                  <Menu>
                      <MenuButton p={1} pr={3}>
                          <NotificationBadge
                            count={bell.length}
                            effect={Effect.SCALE}
                          />
                        <BellIcon fontSize={"2xl"} m={1} />
                      </MenuButton>
                      <MenuList px={2}>
                          {!bell.length && "No New Messages"}
                          {bell.map(n => (
                              <MenuItem
                                  key={n._id}
                                  onClick={()=>{
                                      setSelectedChat(n.chat);
                                      setBell(bell.filter((note)=> note !== n));
                                  }}
                              >

                                  {n.chat.isGroupChat ? `New Message in ${n.chat.chatName}`:`New Message from ${getSender(user, n.chat.users)}`}

                              </MenuItem>
                          ))}
                      </MenuList>
                  </Menu>

                  <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                          <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.avatar}></Avatar>
                      </MenuButton>
                      <MenuList>
                          <ProfileModal user={user}>
                              <MenuItem>My Profile</MenuItem>
                          </ProfileModal>
                          <MenuDivider/>
                          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                      </MenuList>
                  </Menu>
              </div>
          </Box>
            <Drawer
                placement='left'
                isOpen={isOpen}
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={"1px"}>
                        Search User
                    </DrawerHeader>

                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input
                                placeholder='Search by uname or email'
                                mr={2}
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading?
                            (<ChatLoading/>):
                            (searchResult?.map((user)=>(
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user._id)}
                                />
                            )))
                        }
                        {loadingChat && <Spinner ml={"auto"} display={"flex"}/>}


                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default SideDrawer;
