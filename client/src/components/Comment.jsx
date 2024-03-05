import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const API_URL = import.meta.env.VITE_API_URL;
const Comment = ({ comment }) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/${comment.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data);
                setUser(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        getUser();
    }, [comment]);
    return (
        <div className="flex p-4 border-b text-sm ">
            <div className="flex-shrink-0 mr-3">
                <img src={user?.profilePic} alt={user?.username} className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold truncate text-xs mr-1">{user ? `@${user.username}` : `Anonymous`}</span>

                    <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                </div>

                <p className="pb-2">{comment.content}</p>
            </div>
        </div>
    );
};

export default Comment;
