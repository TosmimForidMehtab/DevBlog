import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
    const { user } = useSelector((state) => state.user);
    return user && user?._id?.length > 20 ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
