import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export default function IsLogin () {
    useEffect(() => {
        const checkAuthorization = async () => {
                try {
                    const userInfo = await axios.get('http://localhost:3000/staff/user', {
                        withCredentials: true
                    })
                    const roles = userInfo.data.user.role;
                    
                    if (roles == 'admin') {
                        Navigate('/dashboard')
                    } else if (roles == 'petugas') {
                        Navigate('/Petugas')
                    } else if (roles == 'customer') {
                        Navigate('/')
                    } else {
                        Navigate(<Outlet />)
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                }
        };

        checkAuthorization();
    }, []);
};