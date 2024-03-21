import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";

import { RxHamburgerMenu } from "react-icons/rx";
import { FaBook } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";

import Notification from "@/Auth/OrderNotification"

export default function Sidebar () {
    const Navigate = useNavigate()
    const [ Roles, setRoles ] = useState(null)

    useEffect(() => {
        const checkAuthorization = async () => {
                try {
                    const userInfo = await axios.get('http://localhost:3000/user/user', {
                        withCredentials: true
                    })
                    const roles = userInfo.data.user.role;
                    console.log('this is the role: ', roles)
                    setRoles(roles)
                } catch (error) {
                    console.error('Error verifying token:', error);
                    setRoles(false);
                }
        };
        checkAuthorization();
    }, []);

    return (
        <div>
            <div className="lg:hidden bg-white h-full">
                <Sheet>
                    <SheetTrigger>
                        <div className="p-3">
                            <RxHamburgerMenu
                                style={{ width: "25px", height: "25px" }}
                            />
                        </div>
                    </SheetTrigger>
                    <SheetContent side={"left"}>
                        <SheetHeader>
                            <SheetTitle className="mb-5 text-left">
                                Dashboard
                            </SheetTitle>
                            <SheetDescription className="flex flex-col gap-y-3">
                                {Roles === null ? (
                                    <>
                                        <Skeleton className="p-6 bg-slate-200" />
                                        <Skeleton className="p-6 bg-slate-200" />
                                        <Skeleton className="p-6 bg-slate-200" />
                                        <Skeleton className="p-6 bg-slate-200" />
                                        <Skeleton className="p-6 bg-slate-200" />
                                        <Skeleton className="p-6 bg-slate-200" />
                                    </>
                                ) : Roles === false ? (
                                    <p>Error verifying token</p>
                                ) : Roles === "admin" ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                Navigate("/dashboard")
                                            }
                                            className="p-3 flex items-center gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                                        >
                                            <GrUserAdmin />
                                            <p>Admin</p>
                                        </button>
                                        <button
                                            onClick={() =>
                                                Navigate("/comment")
                                            }
                                            className="p-3 flex items-center gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                                        >
                                            <GrUserAdmin />
                                            <p>Feedback List</p>
                                        </button>
                                        <button
                                            onClick={() =>
                                                Navigate("/product")
                                            }
                                            className="p-3 flex items-center gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                                        >
                                            <GrUserAdmin />
                                            <p>Product</p>
                                        </button>
                                    </>
                                ) : null}

                                {Roles === "admin" || Roles === "petugas" ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                Navigate("/pesanan")
                                            }
                                            className="p-3 flex items-center gap-x-5 bg-gray-100 hover:bg-slate-200 duration-200 text-slate-700 font-semibold"
                                        >
                                            <FaShoppingCart />
                                            <p>Pesanan</p>
                                        </button>
                                        <button
                                            onClick={() =>
                                                Navigate("/reservasi")
                                            }
                                            className="p-3 flex items-center gap-x-5 bg-gray-100 hover:bg-slate-200 duration-200 text-slate-700 font-semibold"
                                        >
                                            <FaBook />
                                            <p>Reservasi</p>
                                        </button>
                                        <button
                                            onClick={() =>
                                                Navigate("/history")
                                            }
                                            className="p-3 flex items-center gap-x-5 bg-gray-100 hover:bg-slate-200 duration-200 text-slate-700 font-semibold"
                                        >
                                            <FaBook />
                                            <p>History Pemesanan</p>
                                        </button>
                                    </>
                                ) : null}
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="hidden lg:block w-30 bg-white p-5 h-full w-[250px] border-r border-zinc-300">
                <h1 className="font-bold text-lg tracking-wide">Dashboard</h1>
                <Separator className="mb-5 mt-2 bg-zinc-700" />
                <div className="flex flex-col gap-y-4">
                    {Roles === null ? (
                        <>
                            <Skeleton className="p-6 bg-slate-200" />
                            <Skeleton className="p-6 bg-slate-200" />
                            <Skeleton className="p-6 bg-slate-200" />
                            <Skeleton className="p-6 bg-slate-200" />
                            <Skeleton className="p-6 bg-slate-200" />
                            <Skeleton className="p-6 bg-slate-200" />
                        </>
                    ) : Roles === false ? (
                        <p>Error</p>
                    ) : Roles === "admin" ? (
                        <>
                            <button
                                onClick={() => Navigate("/dashboard")}
                                className="p-3 flex items-center duration-200 gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                                <GrUserAdmin />
                                <p>Admin</p>
                            </button>
                            <button
                                onClick={() => Navigate("/comment")}
                                className="p-3 flex items-center duration-200 gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                                <GrUserAdmin />
                                <p>Feedback List</p>
                            </button>
                            <button
                                onClick={() => Navigate("/product")}
                                className="p-3 flex items-center duration-200 gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                                <GrUserAdmin />
                                <p>Product</p>
                            </button>
                        </>
                    ) : null}

                    {Roles === "admin" || Roles === "petugas" ? (
                        <>
                            <button
                                onClick={() => Navigate("/pesanan")}
                                className="p-3 flex items-center duration-200 gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                                <FaShoppingCart />
                                <p>Pesanan</p>
                            </button>
                            <button
                                onClick={() => Navigate("/reservasi")}
                                className="p-3 flex items-center duration-200 gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                                <FaBook />
                                <p>Reservasi</p>
                            </button>
                            <button
                                onClick={() => Navigate("/history")}
                                className="p-3 flex items-center duration-200 gap-x-5 bg-gray-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                                <FaBook />
                                <p>History Pemesanan</p>
                            </button>
                        </>
                    ) : null}
                    <Notification />
                </div>
            </div>
        </div>
    );
}