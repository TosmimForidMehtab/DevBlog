import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { updateStart, updateSuccess, updateFailure, setErrorMsg } from "../redux/user/userSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { user, errorMsg, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const fileRef = useRef(null);
    const dispatch = useDispatch();
    const [formData, setformData] = useState({});
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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setformData({
                        ...formData,
                        profilePic: downloadURL,
                    });
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
        if (Object.keys(formData).length === 0) {
            return;
        }

        try {
            dispatch(updateStart());
            const response = await axios.put(`${API_URL}/users/${user._id}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            });
            dispatch(updateSuccess(response.data.data));
        } catch (error) {
            dispatch(updateFailure(error.response?.data || error.message));
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

                <div className="flex justify-between mt-5 text-red-500 font-semibold">
                    <span className="cursor-pointer">Delete Account</span>
                    <span className="cursor-pointer">Sign Out</span>
                </div>
            </form>

            {errorMsg && <ToastContainer position="top-center">{toast.error(errorMsg)}</ToastContainer>}
        </div>
    );
};

export default Profile;
