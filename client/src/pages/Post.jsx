import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, FooterDivider, Spinner } from "flowbite-react";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const API_URL = import.meta.env.VITE_API_URL;
const Post = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [recentPosts, setrecentPosts] = useState(null);
    useEffect(() => {
        const fetchPost = async () => {
            const isId = /^[A-Za-z0-9]*$/.test(slug) && slug.length === 24;
            // console.log(isId);
            let key = "slug";
            if (isId) {
                key = "postId";
            }
            try {
                setError(null);
                setLoading(true);
                console.log(slug);
                const response = await axios.get(`${API_URL}/posts?${key}=${slug}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data.posts[0]);
                setPost(response.data.data.posts[0]);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                setError(null);
                setLoading(true);
                const response = await axios.get(`${API_URL}/posts?limit=3`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setrecentPosts(response.data.data.posts);
                // console.log(response.data.data.posts);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchRecentPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner aria-label="Extra large spinner example" size="xl" color={"warning"} />
            </div>
        );
    }
    return (
        <main className="flex flex-col p-3 max-w-5xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold mb-4 mt-10 max-w-lg mx-auto lg:text-4xl">{post?.title}</h1>

            <Link to={`/search?category=${post?.category}`} className="self-center mt-5">
                <Button className="max-w-lg mx-auto" color="gray" size="md" pill>
                    {post && post.category}
                </Button>
            </Link>

            <img src={post?.image} alt={post?.title} className="w-full h-96 object-cover mt-10" />
            <div className="flex justify-between border-b border-gray-300 p-2 mx-auto text-xs w-full max-w-4xl">
                <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                <span className="italic">{(post?.content.length / 800).toFixed(0)} mins read</span>
            </div>

            <div dangerouslySetInnerHTML={{ __html: post?.content }} className="p-3 w-full max-w-3xl mx-auto post-content"></div>

            <FooterDivider />

            <CommentSection id={post?._id} />

            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent Posts</h1>

                <div className="flex flex-wrap justify-center gap-5 mt-5">{recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}</div>
            </div>
        </main>
    );
};

export default Post;
