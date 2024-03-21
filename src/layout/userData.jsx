import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import * as yup from "yup";
import { useFormik } from 'formik';
import moment from "moment";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function UserData () {
    const [Users, setUsers] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("")
    const [error, setError] = useState("");
    const [FormRole, setFormRole] = useState("")

    useEffect(() => {
        getUsers();
    }, [page, keyword, role]);

    useEffect(() => {
        Create.setFieldValue('role', FormRole)
    }, [FormRole]);

    const Create = useFormik({
        initialValues: {
            username: "",
            password: "",
            email: "",
            notelp: "",
            role: ""
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("username is required").min(5, "Username must be at least 5 characters long"),
            password: yup.string().required("password is required").min(5, "Password must be at least 5 characters long"),
            email: yup.string().email().required("email is required"),
            notelp: yup.number().required("nomor telp is required"),
            role: yup.string().required("role is required")
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/user/add', {
                    username: Create.values.username,
                    password: Create.values.password,
                    email: Create.values.email,
                    notelp: Create.values.notelp,
                    role: Create.values.role
                })
                console.log(response)
                window.location.reload();
            } catch (error) {
                console.error("Error response:", error.response);
                setError(error.response.data.message || "An error occurred");
            }
        },
    });

    const getUsers = async () => {
        const response = await axios.get(`http://localhost:3000/user/get?search_query=${keyword}&page=${page}&limit=${limit}&role=${role}`);
        console.log(response)
        setUsers(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/user/delete/${id}`)
            console.log(response)
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (date) => {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }

    const changePage = ({ selected }) => {
        setPage(selected);
    };

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(query);
    };

    return (
        <div className="w-[650px] border mb-10 shadow-lg p-6 rounded-lg bg-white border-zinc-700">
            <h1 className="font-bold text-2xl tracking-wide">Staff Account</h1>
            <p className="text-sm mb-5 mt-1 text-slate-400">Managment for staff account</p>
            <form onSubmit={searchData}>
                <div className="flex">
                    <input
                    type="text"
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-zinc-700"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Nama Akun / Email"
                    />

                    <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                    <AlertDialog>
                        <AlertDialogTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Add</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Create Staff Account</AlertDialogTitle>
                                <form onSubmit={Create.handleSubmit}>
                                    <Input
                                        placeholder="Username"
                                        type="text"
                                        name="username"
                                        value={Create.values.username}
                                        onChange={Create.handleChange}
                                        className="mt-3 border-black"
                                    />
                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.username && <>{Create.errors.username}</>}</p>

                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        value={Create.values.password}
                                        onChange={Create.handleChange}
                                        className="mt-3 border-black"
                                    />
                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.password && <>{Create.errors.password}</>}</p>

                                    <Input
                                        placeholder="Email"
                                        type="text"
                                        name="email"
                                        value={Create.values.email}
                                        onChange={Create.handleChange}
                                        className="mt-3 border-black"
                                    />
                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.email && <>{Create.errors.email}</>}</p>

                                    <Input
                                        placeholder="No Telp"
                                        type="text"
                                        name="notelp"
                                        value={Create.values.notelp}
                                        onChange={Create.handleChange}
                                        className="mt-3 border-black"
                                    />
                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.notelp && <>{Create.errors.notelp}</>}</p>

                                    <Select value={FormRole} onValueChange={setFormRole}>
                                        <SelectTrigger className="border-black mt-3">
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="petugas">Petugas</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.role && <>{Create.errors.role}</>}</p>

                                    <p className="text-red-500 text-sm">{error && <>{error}</>}</p>
                                </form>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={Create.handleSubmit}>Create</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Filter</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Filter Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => { setRole(""); }}>All</DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => { setRole("petugas"); }}>Petugas</DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => { setRole("admin"); }}>Admin</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                    <button
                    type="submit"
                    className="py-2 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 focus:outline-none duration-200 focus:bg-zinc-700">Search</button>
                </div>
            </form>

            <Separator className="my-3 bg-zinc-300" />

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-200 text-slate-800">
                            <th className="py-3 px-4">Username</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Roles</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Users ? (
                        Users.map((User) => (
                            <tr key={User._id} className="border-t border-gray-300">
                                <td className="py-3 px-4">{User.username}</td>
                                <td className="py-3 px-4">{User.email}</td>
                                <td className="py-3 px-4">
                                    <div className={`text-sm text-white w-fit py-1 px-2 rounded-md font-semibold ${User.role === 'petugas' ? 'bg-orange-500' : User.role === 'admin' ? 'bg-blue-500' : ''}`}>
                                        {User.role}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                <Popover>
                                    <PopoverTrigger className="bg-slate-800 py-2 px-4 text-white rounded-lg text-sm hover:bg-slate-900 duration-200">Detail</PopoverTrigger>
                                    <PopoverContent className="flex flex-col w-[150px]">
                                        <h1 className="text-left font-semibold">Details</h1>
                                        <Separator className="mb-2 mt-1 bg-zinc-400" />

                                        <Dialog>
                                            <DialogTrigger className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-slate-200 duration-200 text-left">Info</DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                <DialogTitle className="text-lg">Account Information</DialogTitle>
                                                <Separator className="mb-2 mt-1 bg-zinc-400" />
                                                <div>
                                                    <p className="mt-2">Username : {User.username}</p>
                                                    <p>Email : {User.email}</p>
                                                    <p>No Telp : {User.notelp}</p>
                                                    <div className={`text-sm mt-3 text-white w-fit py-1 px-2 rounded-md font-semibold ${User.role === 'petugas' ? 'bg-orange-500' : User.role === 'admin' ? 'bg-blue-500' : ''}`}>
                                                        {User.role}
                                                    </div>
                                                    <p className="text-sm mt-3">Created at {formatDate(User.createdAt)}</p>
                                                    <p className="text-sm mt-1">Updated at {formatDate(User.updatedAt)}</p>
                                                </div>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-red-500 hover:text-white duration-200 text-left">Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah anda yakin ingin menghapus akun ini?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteUser(User._id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </PopoverContent>
                                </Popover>
                                </td>
                            </tr>
                        ))
                    ) : (
                        (Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index}>
                                <td colSpan="6" className="py-3 px-4">
                                    <Skeleton className="py-5 px-6 bg-slate-200" />
                                </td>
                            </tr>
                        )))
                    )}
                    </tbody>
                </table>
            </div>

            <Separator className="my-3 bg-zinc-400 mt-5" />

            <div className="flex justify-between items-center mt-4">
                <p className="text-slate-600">Total Row(s): {rows} Page: {rows ? page + 1 : 0} of {pages}</p>

                <div className="">
                    <ReactPaginate
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={Math.min(2, pages)}
                    onPageChange={changePage}
                    containerClassName={"flex"}
                    pageLinkClassName={"mx-2 py-1 px-3 rounded-lg border bg-white border-black hover:bg-gray-100"}
                    previousLinkClassName={"mx-2 py-1 px-3 rounded-lg border bg-white border-black hover:bg-gray-100"}
                    nextLinkClassName={"mx-2 py-1 px-3 rounded-lg border bg-white border-black hover:bg-gray-100"}
                    activeClassName={"pagination-link is-current"}
                    disabledClassName={"pagination-link is-disabled"}
                    />
                </div>
            </div>
        </div>
    )
}