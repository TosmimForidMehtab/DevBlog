import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const DashBoard = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthsUsers, setLastMonthsUsers] = useState(0);
    const [lastMonthsPosts, setLastMonthsPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/users?limit=5`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data);
                setUsers(response.data.data.users);
                setTotalUsers(response.data.data.totalUsers);
                setLastMonthsUsers(response.data.data.lastMonthUsers);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts?limit=5`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data);
                setPosts(response.data.data.posts);
                setTotalPosts(response.data.data.totalPosts);
                setLastMonthsPosts(response.data.data.lastMonthsPosts);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${API_URL}/comments?limit=5`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                console.log(response.data.data);
                setComments(response.data.data.comments);
                setTotalComments(response.data.data.totalComments);
                setLastMonthComments(response.data.data.lastMonthComments);
            } catch (error) {
                console.log(error);
            }
        };

        if (user.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [user._id]);
    return (
        <div className="p-3 sm:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col p-3 gap-4 sm:w-72 w-full rounded-md shadow-md dark:shadow-gray-600">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="text-white text-5xl p-3 shadow-lg rounded-full bg-teal-600 dark:shadow-gray-600" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthsUsers}
                        </span>
                        <div>Last Month</div>
                    </div>
                </div>

                <div className="flex flex-col p-3 gap-4 sm:w-72 w-full rounded-md shadow-md dark:shadow-gray-600">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg uppercase">Total Posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="text-white text-5xl p-3 shadow-lg rounded-full bg-green-400 dark:shadow-gray-600" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthsPosts}
                        </span>
                        <div>Last Month</div>
                    </div>
                </div>

                <div className="flex flex-col p-3 gap-4 sm:w-72 w-full rounded-md shadow-md dark:shadow-gray-600">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg uppercase">Total Comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="text-white text-5xl p-3 shadow-lg rounded-full bg-purple-600 dark:shadow-gray-600" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div>Last Month</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mx-auto py-3">
                <div className="flex flex-col w-full sm:w-auto shadow-md rounded-md p-2 dark:shadow-gray-600 ">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Users</h1>
                        <Button gradientDuoTone={"purpleToPink"} size={"sm"}>
                            <Link to="/dashboard?tab=users">View All</Link>
                        </Button>
                    </div>

                    <Table striped={true} hoverable className="">
                        <Table.Head>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Profile Pic</Table.HeadCell>
                        </Table.Head>

                        {users.map((user) => (
                            <Table.Body className="divide-y" key={user._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{user.username}</Table.Cell>
                                    <Table.Cell>
                                        <img src={user.profilePic} alt={user.username} className="h-12 w-12 rounded-full" />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

                <div className="flex flex-col w-full sm:w-auto shadow-md rounded-md p-2 dark:shadow-gray-600 ">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Posts</h1>
                        <Button gradientDuoTone={"purpleToPink"} size={"sm"}>
                            <Link to="/dashboard?tab=posts">View All</Link>
                        </Button>
                    </div>

                    <Table striped={true} hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                        </Table.Head>

                        {posts.map((post) => (
                            <Table.Body className="divide-y" key={post._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-96">{post.title}</Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-5">{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <img src={post.image} alt={post.slug} className="h-12 w-12 rounded-full" />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

                <div className="flex flex-col w-full sm:w-auto shadow-md rounded-md p-2 dark:shadow-gray-600 ">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Comments</h1>
                        <Button gradientDuoTone={"purpleToPink"} size={"sm"}>
                            <Link to="/dashboard?tab=comments">View All</Link>
                        </Button>
                    </div>

                    <Table striped={true} hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>

                        {comments.map((comment) => (
                            <Table.Body className="divide-y" key={comment._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-96">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
