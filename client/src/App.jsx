import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Signin from "./pages/Signin.jsx";
import Signout from "./pages/Signout.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Header from "./components/Header.jsx";
import { Button } from "flowbite-react";
import FooterComponent from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./App.css";
import AdminRoute from "./components/AdminRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signout" element={<Signout />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path="/create-post" element={<CreatePost />} />
                </Route>
                <Route path="/projects" element={<Projects />} />
            </Routes>
            <FooterComponent />
        </>
    );
};

export default App;
