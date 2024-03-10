import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { updateStart, updateSuccess, updateFailure, setErrorMsg, deleteUserStart, deleteUserSuccess, deleteUserFailure, singOutSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { user, errorMsg, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [fileUploading, setFileUploading] = useState(false);
    const fileRef = useRef(null);
    const [userUpdateSuccess, setuserUpdateSuccess] = useState(false);
    const dispatch = useDispatch();
    const [formData, setformData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const handleImageChange = (e) => {
        dispatch(setErrorMsg());
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        dispatch(setErrorMsg());
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setFileUploadError(null);
        dispatch(setErrorMsg());
        setFileUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setFileUploadError("Error uploading image (File must be an image and less than 2MB)");
                setFileUploadProgress(null);
                setImageFileUrl(null);
                setImageFile(null);
                setFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setformData({
                        ...formData,
                        profilePic: downloadURL,
                    });
                    setFileUploading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        dispatch(setErrorMsg());
        setformData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setErrorMsg());
        if (Object.keys(formData).length === 0 || fileUploading) {
            return;
        }

        try {
            dispatch(updateStart());
            const response = await axios.put(`${API_URL}/users/${user._id}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            dispatch(updateSuccess(response.data.data));
            setuserUpdateSuccess(true);
        } catch (error) {
            console.log(error);
            dispatch(updateFailure(error.response?.data.message || error.message));
        }
    };
    const handleDelete = async () => {
        setShowModal(false);
        dispatch(setErrorMsg());
        try {
            dispatch(deleteUserStart());
            const _ = await axios.delete(`${API_URL}/users/${user._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            dispatch(deleteUserSuccess());
            localStorage.removeItem("accessToken");
            navigate("/login");
        } catch (error) {
            dispatch(deleteUserFailure(error.response?.data.message || error.message));
        }
    };
    const handleSignout = () => {
        try {
            const _ = axios.post(`${API_URL}/users/signout`);
            dispatch(singOutSuccess());
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full max-w-lg mx-auto p-3">
            <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleImageChange} />
                <div className="relative w-32 h-32 self-center cursor-pointer" onClick={() => fileRef.current.click()}>
                    {fileUploadProgress && (
                        <CircularProgressbar
                            value={fileUploadProgress || 0}
                            text={`${fileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(0, 128, 128, ${fileUploadProgress / 100})`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || user?.profilePic}
                        alt="User"
                        className={`w-full h-full rounded-full border-[5px] border-[#f1a1a1] object-cover ${fileUploadProgress && fileUploadProgress < 100 ? "opacity-60" : ""}`}
                    />
                </div>
                {fileUploadError && (
                    <Alert color="failure">
                        <span>{fileUploadError}</span>
                    </Alert>
                )}

                <TextInput type="text" placeholder="Username" id="username" aria-label="Username" className="my-3" defaultValue={user?.username} onChange={handleChange}></TextInput>
                <TextInput type="email" placeholder="Email" id="email" aria-label="Email" className="my-3" defaultValue={user?.email} onChange={handleChange}></TextInput>
                <TextInput type="password" placeholder="Password" id="password" aria-label="Password" className="my-3" onChange={handleChange}></TextInput>

                <Button type="submit" gradientDuoTone={"purpleToPink"} disabled={loading}>
                    {loading ? <Spinner size={"sm"} color={"blue"} /> : "Update"}
                </Button>

                {user && user.isAdmin && (
                    <Button type="button" gradientDuoTone={"purpleToPink"} className="w-full mt-3" onClick={() => navigate("/create-post")}>
                        Create Post
                    </Button>
                )}

                <div className="flex justify-between mt-5 text-red-500 font-semibold">
                    <span className="cursor-pointer" onClick={() => setShowModal(true)}>
                        Delete Account
                    </span>
                    <span className="cursor-pointer" onClick={handleSignout}>
                        Sign Out
                    </span>
                </div>
            </form>

            {user && !user.isAdmin && (
                <div className="text-center mt-4">
                    Verify your email&nbsp;
                    <span>
                        <Link to="/verify-email" className="text-blue-500">
                            here
                        </Link>
                    </span>{" "}
                    to be an admin.
                </div>
            )}

            {errorMsg && <ToastContainer position="top-center">{toast.error(errorMsg)}</ToastContainer>}
            {userUpdateSuccess && <ToastContainer position="top-center">{toast.success("Profile updated successfully")}</ToastContainer>}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={"md"}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-20 h-20 text-red-500 mx-auto"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path
                                d="M9 7v-3a1 1 0 0 1 1 -1h
                                4a1 1 0 0 1 1 1v3"
                            />
                        </svg>

                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">Are you sure you want to delete your account?</h3>

                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;
