import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiUser, HiOutlineLogout, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import axios from "axios";
import { singOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
const API_URL = import.meta.env.VITE_API_URL;
const SideBar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const handleSignout = () => {
        try {
            const _ = axios.post(`${API_URL}/users/signout`);
            dispatch(singOutSuccess());
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        setTab(tabFromUrl);
        console.log(tabFromUrl);
    }, [location.search]);
    return (
        <Sidebar className="w-full sm:w-64">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-2">
                    <Sidebar.Item href="/dashboard?tab=profile" icon={HiUser} label={user.isAdmin ? "Admin" : "User"} labelColor="teal" active={tab === "profile"}>
                        Profile
                    </Sidebar.Item>
                    {user.isAdmin && (
                        <Sidebar.Item href="/dashboard?tab=posts" icon={HiDocumentText} active={tab === "posts"}>
                            Posts
                        </Sidebar.Item>
                    )}
                    {user.isAdmin && (
                        <Sidebar.Item href="/dashboard?tab=users" icon={HiOutlineUserGroup} active={tab === "users"}>
                            Users
                        </Sidebar.Item>
                    )}
                    <Sidebar.Item className="cursor-pointer" icon={HiOutlineLogout} onClick={handleSignout}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default SideBar;
