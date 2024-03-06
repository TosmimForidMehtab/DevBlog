import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const Comment = ({ comment, onLike, onDelete }) => {
    const user = useSelector((state) => state.user);
    const [userInComment, setUserInComment] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/${comment.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data);
                setUserInComment(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        getUser();
    }, [comment]);

    const handleEdit = () => {
        setIsEditing(true);
        setShowButtons(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/comments/edit/${comment._id}`,
                { content: comment.content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log(response.data);
            setIsEditing(false);
            setShowButtons(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setShowButtons(false);
    };
    return (
        <div className="flex p-4 border-b text-sm">
            <div className="flex-shrink-0 mr-3">
                <img src={userInComment?.profilePic} alt={userInComment?.username} className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Link to={userInComment?._id !== user?.user?._id ? `/user/${userInComment?._id}` : `/dashboard?tab=profile`}>
                        <span className="font-bold truncate text-xs mr-1 hover:text-blue-600">{userInComment ? `@${userInComment.username}` : `Anonymous`}</span>
                    </Link>

                    <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                </div>

                {isEditing ? (
                    <Textarea className="w-full border p-2 dark:bg-gray-800" defaultValue={comment.content} onChange={(e) => (comment.content = e.target.value)} rows={3} />
                ) : (
                    <>
                        <p className="pb-2">{comment.content}</p>

                        <div className="flex items-center gap-2">
                            <button
                                className={`text-sm ${user.user?._id && comment?.likes?.includes(user?.user._id) ? "text-pink-600" : "text-gray-500"} hover:text-pink-600`}
                                type="button"
                                onClick={() => onLike(comment._id)}
                            >
                                <FaHeart size={13} />
                            </button>

                            <p className="text-xs text-gray-400">{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")}</p>

                            {user.user && (comment.userId === user.user._id || user.user.isAdmin) && (
                                <>
                                    <button type="button" className="text-sm text-gray-500 hover:text-blue-500" onClick={handleEdit}>
                                        Edit
                                    </button>

                                    <button type="button" className="text-sm text-gray-500 hover:text-red-500" onClick={() => onDelete(comment._id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
                {showButtons && (
                    <div className="flex gap-2 items-center mt-2 justify-end">
                        <Button type="button" onClick={handleSave} color="green" size={"xs"}>
                            Save
                        </Button>

                        <Button type="button" onClick={handleCancel} color="pink" size={"xs"}>
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
