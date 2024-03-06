import { Button, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";

const Search = () => {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",
    });
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSideBarData({
                ...sideBarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }

        const fetchPosts = async () => {
            try {
                setError("");
                setLoading(true);
                const searchQuery = urlParams.toString();
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts?${searchQuery}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                // console.log(response?.data?.data);
                setPosts(response?.data?.data.posts);
                setLoading(false);
                if (response?.data?.data.posts.length > 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSideBarData({
                ...sideBarData,
                searchTerm: e.target.value,
            });
        }
        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setSideBarData({
                ...sideBarData,
                sort: order,
            });
        }
        if (e.target.id === "category") {
            const category = e.target.value || "uncategorized";
            setSideBarData({
                ...sideBarData,
                category: category,
            });
        }
    };
    // console.log(sideBarData);

    const handleSubmit = (e) => {
        e.preventDefault();
        const searchQuery = new URLSearchParams();
        if (sideBarData.searchTerm) {
            searchQuery.append("searchTerm", sideBarData.searchTerm);
        }
        if (sideBarData.sort) {
            searchQuery.append("sort", sideBarData.sort);
        }
        if (sideBarData.category) {
            searchQuery.append("category", sideBarData.category);
        }
        navigate(`/search?${searchQuery.toString()}`);
    };

    const handleShowMore = async () => {
        try {
            setError(null);
            const numberOfPosts = posts.length;
            const startIndex = numberOfPosts;

            const urlParams = new URLSearchParams(location.search);
            urlParams.set("startIndex", startIndex);
            const searchQuery = urlParams.toString();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts?${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setPosts([...posts, ...response?.data?.data.posts]);
            if (response?.data?.data.posts.length > 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };
    return (
        <div className="flex flex-col sm:flex-row">
            <div className="p-7 border-b sm:border-r sm:min-h-screen border-gray-500">
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">
                            Search Term
                        </label>
                        <TextInput type="text" id="searchTerm" placeholder="Search" aria-label="Search" icon={AiOutlineSearch} className="" value={sideBarData.searchTerm} onChange={handleChange} />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="whitespace-nowrap font-semibold">
                            Sort By
                        </label>
                        <Select id="sort" className="bg-transparent" value={sideBarData.sort} onChange={handleChange}>
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="category" className="whitespace-nowrap font-semibold">
                            Category
                        </label>
                        <Select id="category" className="bg-transparent" value={sideBarData.category} onChange={handleChange}>
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
                            <option value="all">All</option>
                        </Select>
                    </div>

                    <Button type="submit" gradientDuoTone={"purpleToPink"} className="w-full">
                        Search
                    </Button>
                </form>
            </div>

            <div className="w-full">
                <h1 className="text-3xl font-bold text-center p-3 mt-5">Search Results</h1>
                <div className="flex flex-wrap gap-4 p-7">
                    {!loading && posts.length === 0 && <p className="text-xl mx-auto font-bold">No posts found</p>}
                    {loading && (
                        <div className="flex items-center justify-center w-full h-full">
                            <Spinner size="xl" color={"warning"} />
                        </div>
                    )}
                    {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
                {showMore && (
                    <button className="text-teal-500 text-lg hover:underline p-7 w-full" onClick={handleShowMore}>
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
};

export default Search;
