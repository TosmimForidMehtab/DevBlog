import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import Posts from "../components/Posts";
import Users from "../components/Users";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        setTab(tabFromUrl);
        // console.log(tabFromUrl);
    }, [location.search]);
    return (
        <div className="min-h-screen flex flex-col sm:flex-row">
            <div className="sm:w-64">
                <Sidebar />
            </div>
            {tab === "profile" && <Profile />}
            {tab === "posts" && <Posts />}
            {tab === "users" && <Users />}
        </div>
    );
};

export default Dashboard;
