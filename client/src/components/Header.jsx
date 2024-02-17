import { Button, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
const Header = () => {
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
                <Button color="gray" pill className="w-12 h-10 hidden sm:inline">
                    <FaMoon />
                </Button>
                <Link to="/signin">
                    <Button gradientDuoTone={"purpleToPink"} outline>
                        Sign In
                    </Button>
                </Link>
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
