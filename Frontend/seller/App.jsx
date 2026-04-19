import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * seller/App.jsx is currently redundant because src/App.jsx handles all roles.
 * We'll set this up to redirect to the main seller dashboard if accessed directly.
 */
const SellerApp = () => {
    const { user } = useAuth();

    if (user?.role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default SellerApp;
