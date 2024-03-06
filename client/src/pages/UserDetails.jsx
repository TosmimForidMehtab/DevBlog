import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner, Card } from "flowbite-react";

const API_URL = import.meta.env.VITE_API_URL;
const UserDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setError(null);
                setLoading(true);
                const response = await axios.get(`${API_URL}/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data);
                setUser(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner aria-label="Extra large spinner example" size="xl" color={"warning"} />
            </div>
        );
    }
    return (
        <main className="flex flex-col p-3 max-w-5xl mx-auto min-h-screen justify-center items-center gap-5">
            <h1 className="text-3xl font-bold mb-4">User Details</h1>
            {user ? (
                <div className="flex  gap-5 flex-wrap justify-center">
                    <Card className="max-w-xl w-80">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Username</h5>
                        <p className="font-normal text-gray-500 dark:text-gray-400 text-xl">{user?.username}</p>
                    </Card>

                    <Card className="max-w-xl w-96">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Email</h5>
                        <p className="font-normal text-gray-500 dark:text-gray-400 text-xl">{user?.email}</p>
                    </Card>

                    <Card className="max-w-xl w-40">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Role</h5>
                        <p className="font-normal text-gray-500 dark:text-gray-400 text-xl">{user?.isAdmin ? "Admin" : "User"}</p>
                    </Card>

                    <img src={user?.profilePic} alt="user" className="w-40 h-40 rounded-full" />
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-3xl font-bold">User not found</h1>
                </div>
            )}
        </main>
    );
};

export default UserDetails;
