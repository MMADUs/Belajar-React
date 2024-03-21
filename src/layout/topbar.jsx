import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Topbar () {
    const Navigate = useNavigate()
    const [ Name, setName ] = useState(null)

    useEffect(() => {
        const checkAuthorization = async () => {
                try {
                    const userInfo = await axios.get('http://localhost:3000/user/user', {
                        withCredentials: true
                    })
                    const Name = userInfo.data.user.username;
                    setName(Name)
                } catch (error) {
                    console.error('Error verifying token:', error);
                    setRoles(false);
                }
        };

        checkAuthorization();
    }, []);

    const Logout = async () => {
        try {
            const response = await axios.get('http://localhost:3000/user/logout', {
                withCredentials: true
            })

            if (response.status == 200) {
                Navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full bg-white py-2 px-4 lg:py-4 lg:px-10 flex justify-between shadow-sm">
            <h1 className="font-bold text-sm tracking-wider">Restaurant Dashboard</h1>
            <div className="flex gap-x-1">
                <p className="text-sm">Welcome back,</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-sm hover:underline">{Name}!</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}