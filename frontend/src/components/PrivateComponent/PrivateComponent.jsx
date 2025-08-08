import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateComponent = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";
    return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateComponent;