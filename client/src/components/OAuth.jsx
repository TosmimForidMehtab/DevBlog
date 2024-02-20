import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account",
        });
        try {
            const responseGoogle = await signInWithPopup(auth, provider);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/google`,
                {
                    username: responseGoogle.user.displayName,
                    email: responseGoogle.user.email,
                    photo: responseGoogle.user.photoURL,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            dispatch(signInSuccess(response.data.data));
            navigate("/");
        } catch (error) {
            console.log(error);
            dispatch(signInFailure(error.response?.data?.message || error.message));
            <ToastContainer position="top-center" autoClose={5000} newestOnTop={true} pauseOnFocusLoss draggable pauseOnHover>
                {toast.error(error.response?.data?.message || error.message)}
            </ToastContainer>;
        }
    };
    return (
        <Button type="button" gradientDuoTone={"pinkToOrange"} onClick={handleClick}>
            <span className="mr-2">Continue with Google</span>
            <AiFillGoogleCircle size={20} />
        </Button>
    );
};

export default OAuth;
