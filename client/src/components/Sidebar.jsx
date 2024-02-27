import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiUser, HiOutlineLogout } from "react-icons/hi";

const SideBar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        setTab(tabFromUrl);
        console.log(tabFromUrl);
    }, [location.search]);
    return (
        <Sidebar className="w-full sm:w-64">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="/dashboard?tab=profile" icon={HiUser} label="User" labelColor="teal" active={tab === "profile"}>
                        Profile
                    </Sidebar.Item>
                    <Sidebar.Item href="/signout" icon={HiOutlineLogout}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default SideBar;
