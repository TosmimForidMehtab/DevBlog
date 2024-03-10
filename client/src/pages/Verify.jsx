import { Button, TextInput } from "flowbite-react";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { singOutSuccess } from "../redux/user/userSlice";

const API_URL = import.meta.env.VITE_API_URL;
const Verify = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [sent, setSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState(user?.email);
    const [otp, setOtp] = useState(0);
    const navigate = useNavigate();
    const otpRef = useRef();
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            setSuccess("");
            setError("");
            setSending(true);
            const { data } = await axios.post(
                `${API_URL}/users/send-otp`,
                { email },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (data.success === true) {
                setSent(true);
                setSuccess(data.message);
                otpRef.current.focus();
            }
            setSending(false);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || error.message);
            setSending(false);
        }
    };
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            setSuccess("");
            setError("");
            setVerifying(true);
            const { data } = await axios.post(
                `${API_URL}/users/verify-otp`,
                { email, otp },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (data.success === true) {
                setSuccess(data.message);
                setVerified(true);
            }
            setVerifying(false);
            // navigate("/dashboard?tab=profile");
            const _ = axios.post(`${API_URL}/users/signout`);
            dispatch(singOutSuccess());
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || error.message);
            setVerifying(false);
        }
    };
    return (
        <div className="min-h-screen max-w-[50%] mx-auto">
            <h1 className="text-3xl font-bold text-center my-7">Verify Email</h1>
            <form onSubmit={handleSendOtp} className={sent ? "hidden" : ""}>
                <TextInput type="email" placeholder="Email" id="email" aria-label="Email" className="my-3" required value={user?.email} disabled />
                <Button type="submit" gradientDuoTone="purpleToPink" className="w-full" disabled={sending}>
                    Send OTP
                </Button>
            </form>
            <form onSubmit={handleVerifyOtp} className="mt-9">
                <TextInput
                    type="number"
                    placeholder="OTP"
                    id="otp"
                    aria-label="OTP"
                    className="my-3"
                    required
                    onChange={(e) => {
                        setOtp(e.target.value);
                        setError("");
                        setSuccess("");
                    }}
                    value={otp || ""}
                    disabled={verifying || !sent}
                    ref={otpRef}
                />
                <Button type="submit" gradientDuoTone="purpleToPink" className="w-full" disabled={verifying || !sent}>
                    Verify
                </Button>
            </form>

            {error && (
                <ToastContainer position="top-center" theme="dark">
                    {toast.error(error)}
                </ToastContainer>
            )}
            {success && (
                <ToastContainer position="top-center" theme="dark">
                    {toast.success(`${success}`)}
                </ToastContainer>
            )}
        </div>
    );
};

export default Verify;
