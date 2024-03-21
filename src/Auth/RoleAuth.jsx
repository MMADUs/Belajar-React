import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
                try {
                    const userInfo = await axios.get('http://localhost:3000/user/user', {
                        withCredentials: true
                    })
                    const roles = userInfo.data.user.role;

                    setIsAuthorized(allowedRoles.includes(roles));
                } catch (error) {
                    console.error('Error verifying token:', error);
                    setIsAuthorized(false);
                }
        };

        checkAuthorization();
    }, [allowedRoles]);

    if (isAuthorized === null) {
        // Loading here
        return null;
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/error" />;
};

export default ProtectedRoute;