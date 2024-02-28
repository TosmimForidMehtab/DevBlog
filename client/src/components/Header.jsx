import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
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
        <Navbar className="border-b-4">
            <Link to="/" className="text-sm sm:text-xl font-semibold whitespace-nowrap self-center dark:text-white">
                <span className="px-2 py-1 mr-1 bg-indigo-500 rounded-s-full text-white">Dev's</span>
                <span className="px-2 py-1 bg-red-500 rounded-e-full text-white">Blog</span>
            </Link>

            <form>
                <TextInput type="search" placeholder="Search" aria-label="Search" icon={AiOutlineSearch} className="hidden sm:inline" />
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
                <Navbar.Link>
                    <NavLink to="/projects" className={({ isActive }) => (isActive ? "text-blue-500" : "")}>
                        Projects
                    </NavLink>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
