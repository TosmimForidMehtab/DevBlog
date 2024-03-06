import React from "react";

const About = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-3 text-center">
                <div>
                    <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl font-bold text-center my-7">About Dev's Blog</h1>
                    <div className="flex flex-col gap-6">
                        <p className="">
                            A place for developers to share their knowledge to fellow developers and learn from each other. Blogs on various topics such as React, JavaScript, Node.js, Backend
                            Development, etc are available. This is a free to use blog. Just register and start sharing your knowledge.
                        </p>

                        <p>
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">Dev's Blog</span> is a platform that provides a space
                            for developers to share their knowledge and learn from each other. It is a free to use blog.
                        </p>

                        <p>
                            The platform is designed to be user-friendly and easy to navigate. It is suitable for developers who want to share their knowledge and get feedback from fellow developers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
