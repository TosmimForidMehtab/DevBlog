import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Signin from "./pages/Signin.jsx";
import Signout from "./pages/Signout.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Header from "./components/Header.jsx";
import { Button } from "flowbite-react";
import FooterComponent from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./App.css";
import AdminRoute from "./components/AdminRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UpdatePost from "./pages/UpdatePosts.jsx";
import Post from "./pages/Post.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import Search from "./pages/Search.jsx";
import Verify from "./pages/Verify.jsx";
const App = () => {
    return (
        <>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signout" element={<Signout />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/search" element={<Search />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/verify-email" element={<Verify />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:id" element={<UpdatePost />} />
                </Route>
                <Route path="/post/:slug" element={<Post />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="*" element={<Home />} />
            </Routes>
            <FooterComponent />
        </>
    );
};

export default App;
