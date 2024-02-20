import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import OAuth from "../components/OAuth";

const API_URL = import.meta.env.VITE_API_URL;
const Signup = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setErrorMsg(null);
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        setErrorMsg(null);
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMsg("All fields are required");
        }
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/users/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data.data.message);
            setLoading(false);
            setFormData({});
            if (response.status === 201) {
                toast.success(response.data.data.message);
                navigate("/signin");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setErrorMsg(error.response?.data || error);
        }
    };
    return (
        <>
            <div className="mt-20 min-h-screen">
                <div className="flex p-3 max-w-3xl mx-auto flex-col sm:flex-row sm:items-center gap-5">
                    <div className="flex-1">
                        <Link to="/" className=" font-bold dark:text-white">
                            <span className="px-2 py-1 mr-1 bg-indigo-500 rounded-s-full text-white">Dev's</span>
                            <span className="px-2 py-1 bg-red-500 rounded-e-full text-white">Blog</span>
                        </Link>
                        <p className="mt-2">
                            This is a blog <span className="text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">for developers</span>, by developers
                            discussing new technologies and tools that can help them.
                        </p>
                    </div>
                    <div className="flex-1">
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="username" value="Your username" />
                                <TextInput id="username" type="text" placeholder="John" onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="email" value="Your email" />
                                <TextInput id="email" type="email" placeholder="john@gmail.com" onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="password" value="Your password" />
                                <div className="flex items-center">
                                    {/* <TextInput id="password" type={show ? "text" : "password"} placeholder="P@ssword123" className="w-full outline-none" onChange={handleChange} /> */}
                                    <TextInput id="password" type={show ? "text" : "password"} placeholder="P@ssword123" className="w-full outline-none" onChange={handleChange} required />
                                    <Button
                                        color="purple"
                                        onClick={() => {
                                            setShow(!show);
                                            setErrorMsg(null);
                                        }}
                                        size={"sm"}
                                        pill
                                    >
                                        {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    </Button>
                                </div>
                            </div>
                            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
                                {loading ? <Spinner size={"sm"} color={"blue"} /> : "Sign Up"}
                            </Button>
                            <OAuth />
                        </form>

                        <div className="flex gap-2 mt-4">
                            <span>Already have an account?</span>
                            <Link to="/signin" className="text-blue-500">
                                Sign In
                            </Link>
                        </div>
                        {errorMsg && (
                            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover>
                                {toast.error(errorMsg.message)}
                            </ToastContainer>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
