import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteUserSuccess } from "../redux/user/userSlice";

const API_URL = import.meta.env.VITE_API_URL;
const Users = () => {
    const { user } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userId, setuserId] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                const response = await axios.get(`${API_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data.users.length);
                setUsers(response?.data?.data);
                if (users.users?.length > 9) {
                    setShowMore(true);
                }
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || error.message);
            }
        };

        if (user.isAdmin) {
            fetchUsers();
        }
    }, [user._id]);

    const handleShowMore = async () => {
        const startIndex = users.users?.length;
        try {
            setError(null);
            const response = await axios.get(`${API_URL}/users?startIndex=${startIndex}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setUsers({
                ...users,
                users: [...users.users, ...response?.data?.data.users],
            });
            setShowMore(false);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.log(error);
        }
    };

    const handleDelete = async () => {
        setShowModal(false);
        try {
            setError(null);
            const _ = await axios.delete(`${API_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setUsers({
                ...users,
                users: users.users.filter((user) => user._id !== userId),
            });
            if (userId === user._id) {
                dispatch(deleteUserSuccess());
                localStorage.removeItem("accessToken");
                navigate("/signin");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || error.message);
        }
    };
    return (
        <div
            className="table-auto overflow-x-scroll sm:mx-auto p-3 w-full scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
        dark:scrollbar-track-gray-800"
        >
            {user.isAdmin && users.users?.length > 0 ? (
                <Table hoverable={true} className="shadow-md">
                    <Table.Head>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>User Image</Table.HeadCell>
                        <Table.HeadCell>Admin</Table.HeadCell>
                        <Table.HeadCell>Created At</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>
                    {users.users?.map((user) => (
                        <Table.Body className="border-b divide-y " key={user._id}>
                            <Table.Cell>
                                <Link to={`/user/${user._id}`} className="font-medium hover:text-blue-600">
                                    {user.username}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/user/${user._id}`} className="font-medium hover:text-blue-600">
                                    {user.email}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <img src={user.profilePic} alt={user.profilePic} className="w-10 h-10 object-cover bg-gray-500 hover:scale-105 rounded-full" />
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {user.isAdmin ? <FaCheckCircle className="text-green-500" size={20} /> : <FaTimesCircle className="text-red-500" size={20} />}
                            </Table.Cell>
                            <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                                <span
                                    className="cursor-pointer text-red-500 font-medium hover:text-red-700"
                                    onClick={() => {
                                        setShowModal(true);
                                        setuserId(user._id);
                                    }}
                                >
                                    DELETE
                                </span>
                            </Table.Cell>
                        </Table.Body>
                    ))}
                </Table>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-3xl font-bold">No Users Found</h1>
                </div>
            )}
            {showMore && (
                <button onClick={handleShowMore} className="font-bold py-2 px-4 text-teal-500 w-full self-center">
                    show more
                </button>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={"md"}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-20 h-20 text-red-500 mx-auto"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path
                                d="M9 7v-3a1 1 0 0 1 1 -1h
                                4a1 1 0 0 1 1 1v3"
                            />
                        </svg>

                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">Are you sure you want to delete this user?</h3>

                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {error && <ToastContainer position="top-center">{toast.error(error)}</ToastContainer>}
        </div>
    );
};

export default Users;
