import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import PostCard from "../components/PostCard";

const API_URL = import.meta.env.VITE_API_URL;
const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts`);
                // console.log(response.data.data.posts);
                setPosts(response.data.data.posts);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();
    }, []);
    const { user } = useSelector((state) => state.user);
    return (
        <div className="min-h-screen">
            <div className="flex flex-col  gap-6 px-3 p-28 max-w-6xl mx-auto">
                <h1 className="text-3xl sm:text-5xl font-bold">
                    Welcome to <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Dev's Blog</span>
                </h1>

                <p className="text-xs sm:text-lg">
                    A place for developers to share their knowledge to fellow developers and learn from each other. Blogs on various topics such as React, JavaScript, Node.js, Backend Development, etc
                    are available . This is a free to use blog. Just register and start sharing your knowledge.
                </p>

                <div className="flex justify-between">
                    <Link to="/search" className="text-indigo-500 hover:text-indigo-700 font-bold py-2 px-4 rounded-full">
                        Explore&gt;
                    </Link>

                    {user && user.isAdmin && (
                        <Link to="/create-post" className="">
                            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full">Write a Post</button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-8 max-w-6xl mx-auto p-3 py-7">
                {posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-semibold text-center">Recent Posts</h2>

                        <div className="flex flex-wrap gap-5 justify-center">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link to="/search" className="text-lg text-teal-500 hover:text-teal-700 font-bold text-center">
                            View All
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
