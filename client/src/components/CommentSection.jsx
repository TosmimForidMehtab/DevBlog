import { Button, Textarea, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CommentSection = ({ id }) => {
    const user = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.user || !comment || comment.length > 200) {
            return;
        }

        try {
            setError("");
            setSuccess("");
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/comments`,
                {
                    content: comment,
                    userId: user?.user._id,
                    postId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            setComment("");
            // console.log(response.data);
            setComments([response.data.data, ...comments]);
            setSuccess(response.data.message);
            setLoading(false);
        } catch (error) {
            setError("");
            setSuccess("");
            setLoading(false);
            setError(error.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setError("");
                setSuccess("");
                const response = await axios.get(`${API_URL}/comments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setComments(response.data.data);
            } catch (error) {
                setError("");
                console.log(error);
            }
        };
        fetchComments();
    }, [id]);

    const handleLike = async (commentId) => {
        try {
            setError("");
            setSuccess("");
            if (!user?.user) {
                navigate("/signin");
                return;
            }
            const response = await axios.put(
                `${API_URL}/comments/like/${commentId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setComments(
                comments.map((c) =>
                    c._id === commentId
                        ? {
                              ...c,
                              likes: response.data.data.likes,
                              numberOfLikes: response.data.data.numberOfLikes,
                          }
                        : c
                )
            );
        } catch (error) {
            setError("");
            console.log(error);
        }
    };

    const handleDelete = async (commentId) => {
        setError("");
        setSuccess("");
        setSuccess("");
        try {
            if (!user?.user) {
                navigate("/signin");
                return;
            }
            const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setComments(comments.filter((c) => c._id !== commentId));
            setSuccess(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.log(error);
        }
    };
    return (
        <div className="w-full max-w-2xl mx-auto p-3">
            {user?.user ? (
                <div className="flex gap-2 items-center my-5 text-sm">
                    <p>Signed in as</p>
                    <img src={user?.user.profilePic} alt={user?.user.username} className="w-5 h-5 object-cover rounded-full" />
                    <Link to={`/dashboard?tab=profile`} className="text-teal-600 text-xs hover:underline">
                        @{user?.user.username}
                    </Link>
                </div>
            ) : (
                <div className="flex gap-1 text-sm my-5 text-teal-500">
                    <p>Sign in to leave a comment</p>
                    <Link to="/signin" className="text-blue-500 hover:underline">
                        Sign In
                    </Link>
                </div>
            )}

            {user?.user && (
                <form className="border border-teal-500 rounded-md p-3" onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Add a comment..."
                        rows={4}
                        maxLength={200}
                        onChange={(e) => {
                            setError("");
                            setSuccess("");
                            setComment(e.target.value);
                        }}
                        value={comment || ""}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-xs">{200 - comment.length} characters left</p>
                        <Button gradientDuoTone={"purpleToPink"} type="submit">
                            {loading ? <Spinner /> : "Comment"}
                        </Button>
                    </div>
                </form>
            )}

            {comments.length === 0 ? (
                <p className="text-sm my-5">No comments yet</p>
            ) : (
                <>
                    <div className="flex gap-1 items-center text-sm my-5">
                        <p>Comments</p>
                        <div className="border border-teal-500 rounded-md py-1 mx-2">
                            <p className="w-5 text-center">{comments.length}</p>
                        </div>
                    </div>

                    {comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} onLike={handleLike} onDelete={handleDelete} />
                    ))}
                </>
            )}

            {error && (
                <ToastContainer position="top-center" pauseOnFocusLoss={false} draggable={false}>
                    {toast.error(error)}
                </ToastContainer>
            )}

            {success && (
                <ToastContainer position="top-center" pauseOnFocusLoss={false} draggable={false}>
                    {toast.success(success)}
                </ToastContainer>
            )}
        </div>
    );
};

export default CommentSection;
