import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import * as yup from "yup";
import { useFormik } from 'formik';

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

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function TableData () {
    const [Tables, setTables] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("")
    const [error, setError] = useState("");

    const Create = useFormik({
        initialValues: {
            no_meja: "",
            letak: "",
        },
        validationSchema: yup.object().shape({
            no_meja: yup.number().required("no meja is required"),
            letak: yup.string().required("deskripsi is required")
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/table/add', {
                    no_meja: Create.values.no_meja,
                    letak: Create.values.letak
                })
                console.log(response)
                window.location.reload();
            } catch (error) {
                console.error("Error response:", error.response);
                setError(error.response.data.message || "An error occurred");
            }
        },
    });

    const Update = useFormik({
        initialValues: {
            no_meja: "",
            letak: "",
        }
    });

    const UpdateTable = async (id) => {
        console.log('this is the id: ', id)
            try {
                const response = await axios.patch(`http://localhost:3000/table/update/${id}`, {
                    no_meja: parseInt(Update.values.no_meja),
                    letak: Update.values.letak
                })
                console.log(response)
                window.location.reload();
            } catch (error) {
                console.error("Error response:", error.response);
                setError(error.response.data.message || "An error occurred");
            }
    }

    useEffect(() => {
        getTables();
    }, [page, keyword, status]);

    const getTables = async () => {
        console.log(status)
        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await axios.get(`http://localhost:3000/table/get?search_query=${keyword}&page=${page}&limit=${limit}&status=${status}`);
        console.log(response)
        setTables(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const tableById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/table/detail/${id}`)
            console.log(response)
            Update.setValues(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTable = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/table/delete/${id}`)
            console.log(response)
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
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
        <div className="w-[540px] bg-white mb-10 border shadow-lg border-zinc-700 p-6 rounded-lg">
            <h1 className="font-bold text-2xl tracking-wide">List Meja</h1>
            <p className="text-sm mb-5 mt-1 text-slate-400">Managment for data meja</p>
            <form onSubmit={searchData}>
                <div className="flex">
                    <input
                    type="text"
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-zinc-700"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Nomor Meja"
                    />

                    <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                    <AlertDialog>
                        <AlertDialogTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Add</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Add Meja</AlertDialogTitle>
                                <form onSubmit={Create.handleSubmit}>
                                    <Input
                                        placeholder="Nomor meja"
                                        type="text"
                                        name="no_meja"
                                        value={Create.values.no_meja}
                                        onChange={Create.handleChange}
                                        className="mt-5 border-black"
                                    />
                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.no_meja && <>{Create.errors.no_meja}</>}</p>

                                    <Input
                                        placeholder="Deskripsi"
                                        type="text"
                                        name="letak"
                                        value={Create.values.letak}
                                        onChange={Create.handleChange}
                                        className="mt-3 border-black"
                                    />
                                    <p className="text-red-500 mt-1 text-sm">{Create.errors.letak && <>{Create.errors.letak}</>}</p>

                                    <p className="text-red-500 mt-1 text-sm">{error && <>{error}</>}</p>
                                </form>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={Create.handleSubmit}>Add</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

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
                            <th className="py-3 px-4">No Meja</th>
                            <th className="py-3 px-4">Deskripsi</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Tables ? (
                        Tables.map((Table) => (
                            <tr key={Table._id} className="border-t border-gray-300">
                                <td className="py-3 px-4 font-bold">{Table.no_meja}</td>
                                <td className="py-3 px-4">{Table.letak}</td>
                                <td className="py-3 px-4">
                                <Popover>
                                    <PopoverTrigger className="bg-slate-800 py-2 px-4 text-white rounded-lg text-sm hover:bg-slate-900 duration-200">Detail</PopoverTrigger>
                                    <PopoverContent className="flex flex-col w-[150px]">
                                        <h1 className="text-left font-semibold">Details</h1>
                                        <Separator className="mb-2 mt-1 bg-zinc-400" />

                                        {/* Edit Table */}
                                        <AlertDialog>
                                            <AlertDialogTrigger onClick={() => tableById(Table._id)} className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white duration-200 text-left">Edit</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Edit Data Meja</AlertDialogTitle>
                                                    <form onSubmit={Update.handleSubmit}>
                                                        <Input
                                                            placeholder="Nomor meja"
                                                            type="text"
                                                            name="no_meja"
                                                            value={Update.values.no_meja}
                                                            onChange={Update.handleChange}
                                                        />
                                                        <p className="text-red-500 mt-1 text-sm">{Update.errors.no_meja && <>{Update.errors.no_meja}</>}</p>

                                                        <Input
                                                            placeholder="Deskripsi"
                                                            type="text"
                                                            name="letak"
                                                            value={Update.values.letak}
                                                            onChange={Update.handleChange}
                                                            className="mt-5"
                                                        />
                                                        <p className="text-red-500 mt-1 text-sm">{Update.errors.letak && <>{Update.errors.letak}</>}</p>

                                                        <p className="text-red-500 mt-1 text-sm">{error && <>{error}</>}</p>
                                                    </form>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => UpdateTable(Table._id)}>Update</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        {/* delete Table */}
                                        <AlertDialog>
                                            <AlertDialogTrigger className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-red-500 hover:text-white duration-200 text-left">Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Meja?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah anda yakin ingin menghapus data meja ini?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteTable(Table._id)}>Delete</AlertDialogAction>
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
                    pageCount={Math.min(10, pages)}
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