import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import axios from "axios";
import { singOutSuccess } from "../redux/user/userSlice";
const API_URL = import.meta.env.VITE_API_URL;
const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);
    // console.log(searchTerm);
    const handleSignout = () => {
        try {
            const _ = axios.post(`${API_URL}/users/signout`);
            dispatch(singOutSuccess());
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    return (
        <Navbar className="border-b-4 sticky top-0 z-50">
            <Link to="/" className="text-sm sm:text-xl font-semibold whitespace-nowrap self-center dark:text-white">
                <span className="px-2 py-1 mr-1 bg-indigo-500 rounded-s-full text-white">Dev's</span>
                <span className="px-2 py-1 bg-red-500 rounded-e-full text-white">Blog</span>
            </Link>

            <form onSubmit={handleSubmit}>
                <TextInput type="search" placeholder="Search" aria-label="Search" icon={AiOutlineSearch} className="hidden sm:inline" onChange={handleChange} value={searchTerm} />
            </form>
            <Button color="purple" className="w-12 h-10 sm:hidden" pill>
                <AiOutlineSearch />
            </Button>
            <div className="flex items-center gap-4 md:order-2">
                <Button color="gray" pill className="w-12 h-10 hidden sm:inline" onClick={() => dispatch(toggleTheme())}>
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </Button>
                {user ? (
                    <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={user?.profilePic} rounded={true} />}>
                        <Dropdown.Header>
                            <span className="block text-sm">@{user.username}</span>
                            <span className="block text-sm font-medium truncate">{user.email}</span>
                        </Dropdown.Header>
                        <Link to={`/dashboard?tab=profile`}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/signin">
                        <Button gradientDuoTone={"purpleToPink"} outline>
                            Sign In
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-500" : "")}>
                        Home
                    </NavLink>
                </Navbar.Link>
                <Navbar.Link>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? "text-blue-500" : "")}>
                        About
                    </NavLink>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
