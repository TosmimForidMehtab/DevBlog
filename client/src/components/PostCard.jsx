import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    return (
        <div className="relative group w-[300px] h-[400px] overflow-hidden">
            <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt={post.title} className="w-full h-[260px] object-cover mt-10 group-hover:h-[200px] transition-all duration-300 z-20" />
            </Link>

            <div className="flex flex-col p-3 gap-2">
                <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
                <span className="text-sm italic">{post.category}</span>

                <Link
                    to={`/post/${post.slug}`}
                    className="z-10 bottom-[-500px] group-hover:bottom-0 absolute left-0 right-0 border hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md m-2"
                >
                    See More
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
