import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
    return (
        <div className="p-3 min-h-screen mx-auto">
            <h1 className="text-center text-3xl font-bold my-7">Create a post</h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <TextInput id="title" type="text" placeholder="Title" required className="flex-1" />

                    <Select id="category" className="">
                        <option value="uncategorized">Select a category</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="javascript">Javascript</option>
                        <option value="react">React Js</option>
                        <option value="nextjs">Next Js</option>
                        <option value="nodejs">Node Js</option>
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                    </Select>
                </div>

                <div className="flex items-center gap-4 justify-between border-4 border-dotted border-green-400 p-4">
                    <FileInput id="image" itemType="file" label="Upload Image" accept="image/*" />
                    <Button color="green" size="sm" type="button" outline>
                        Upload Image
                    </Button>
                </div>

                <ReactQuill theme="snow" placeholder="Write something..." className="h-80 mb-12" />

                <Button gradientDuoTone={"purpleToPink"} type="submit">
                    Publish
                </Button>
            </form>
        </div>
    );
};

export default CreatePost;
