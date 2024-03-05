import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;
const Posts = () => {
    const { user } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [postId, setPostId] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setError(null);
                const response = await axios.get(`${API_URL}/posts?userId=${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data);
                setUserPosts(response?.data?.data);
                if (userPosts.posts?.length > 9) {
                    setShowMore(true);
                }
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || error.message);
            }
        };

        if (user.isAdmin) {
            fetchPosts();
        }
    }, [user._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.posts?.length;
        try {
            setError(null);
            const response = await axios.get(`${API_URL}/posts?userId=${user._id}&startIndex=${startIndex}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setUserPosts({
                ...userPosts,
                posts: [...userPosts.posts, ...response?.data?.data.posts],
            });
            setShowMore(false);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async () => {
        setShowModal(false);
        try {
            setError(null);
            const _ = await axios.delete(`${API_URL}/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setUserPosts({
                ...userPosts,
                posts: userPosts.posts.filter((post) => post._id !== postId),
            });
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.log(error);
        }
    };
    return (
        <div
            className="table-auto overflow-x-scroll sm:mx-auto p-3 w-full scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
        dark:scrollbar-track-gray-800"
        >
            {user.isAdmin && userPosts.posts?.length > 0 ? (
                <Table hoverable={true} className="shadow-md">
                    <Table.Head>
                        <Table.HeadCell>Post Title</Table.HeadCell>
                        <Table.HeadCell>Post Image</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Updated At</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell>
                            <span>Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    {userPosts.posts?.map((post) => (
                        <Table.Body className="border-b divide-y" key={post._id}>
                            <Table.Cell>
                                <Link to={`/post/${post.slug}`} className="font-medium hover:text-blue-600">
                                    {post.title}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/post/${post.slug}`}>
                                    <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500 hover:scale-105" />
                                </Link>
                            </Table.Cell>
                            <Table.Cell>{post.category}</Table.Cell>
                            <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                                <span
                                    className="cursor-pointer text-red-500 font-medium hover:text-red-700"
                                    onClick={() => {
                                        setShowModal(true);
                                        setPostId(post._id);
                                    }}
                                >
                                    DELETE
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/update-post/${post._id}`}>
                                    <span className="cursor-pointer text-blue-500 font-medium hover:text-blue-700">EDIT</span>
                                </Link>
                            </Table.Cell>
                        </Table.Body>
                    ))}
                </Table>
            ) : (
                <div className="flex h-screen items-center justify-center">
                    <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">No Posts Found</h1>
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

                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">Are you sure you want to delete this post?</h3>

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

export default Posts;
