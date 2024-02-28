import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const AdminRoute = () => {
    const { user } = useSelector((state) => state.user);
    // console.log(user?._id);
    return user && user?.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
};

export default AdminRoute;
