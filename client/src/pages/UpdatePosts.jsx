import { Button, FileInput, Select, TextInput, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
    const [file, setFile] = useState(null);
    const [publishing, setPublishing] = useState(false);
    const [formData, setFormData] = useState({});
    const [published, setPublished] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setError(null);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts?postId=${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response.data.data.posts[0]);
                setFormData(response.data.data.posts[0]);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchPost();
    }, [id]);
    const handleChange = (e) => {
        setError(null);
        setPublished(null);
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPublishing(true);
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };
        if (file) {
            headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            };
        }
        try {
            console.log(formData);
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/posts/${id}`, formData, {
                headers,
            });
            console.log(response?.data.data);
            setPublishing(false);
            setPublished(response?.data.message);
            setFormData({
                title: "",
                category: "",
                content: "",
            });

            navigate(`/post/${response?.data?.data.slug}`);
        } catch (error) {
            setPublishing(false);
            console.log(error);
            setError(error.response?.data.message);
        }
    };

    console.log(formData);
    return (
        <div className="p-3 min-h-screen mx-auto">
            <h1 className="text-center text-3xl font-bold my-7">Update post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <TextInput id="title" type="text" placeholder="Title" required className="flex-1" onChange={handleChange} value={formData.title || ""} />

                    <Select id="category" onChange={handleChange} value={formData.category}>
                        <option value="uncategorized">Select a category</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="javascript">Javascript</option>
                        <option value="react">React Js</option>
                        <option value="nextjs">Next Js</option>
                        <option value="nodejs">Node Js</option>
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                        <option value="database">Database</option>
                        <option value="tools">Tools</option>
                        <option value="other">Other</option>
                    </Select>
                </div>

                <div className="flex items-center gap-4 justify-between border-4 border-dotted border-green-400 p-4">
                    <FileInput
                        id="image"
                        itemType="file"
                        label="Upload Image"
                        accept="image/*"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                            setFormData({ ...formData, image: e.target.files[0] });
                        }}
                    />
                    {/* <Button color="green" size="sm" type="button" outline>
                        Upload Image
                    </Button> */}
                </div>

                {(file || formData.image) && <img src={file ? URL.createObjectURL(file) : formData.image ? formData.image : null} alt="Image" className="w-full h-72 object-cover" />}

                <ReactQuill theme="snow" placeholder="Write something..." className="h-80 mb-12" value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} />

                <Button gradientDuoTone={"purpleToPink"} type="submit" disabled={publishing}>
                    {publishing ? <Spinner color="warning" /> : "Update"}
                </Button>
            </form>
            {published && <ToastContainer position="top-center">{toast.success(published)}</ToastContainer>}
            {error && <ToastContainer position="top-center">{toast.error(error)}</ToastContainer>}
        </div>
    );
};

export default UpdatePost;
