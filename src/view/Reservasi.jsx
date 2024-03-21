import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import ReactPaginate from "react-paginate";
import { useFormik } from 'formik';
import moment from "moment";

import Sidebar from "@/layout/sidebar";
import Topbar from "@/layout/topbar";

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

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Reservasi () {
    const [Reservasi, setReservasi] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [user, setUser] = useState("")
    const [inquire, setInquire] = useState("")

    useEffect(() => {
        getReservasi();
    }, [page, keyword]);

    const getReservasi = async () => {
        const response = await axios.get(`http://localhost:3000/reservasi/get?search_query=${keyword}&page=${page}&limit=${limit}`);
        console.log(response)
        setReservasi(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const getUser = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/user/details/${id}`)
            console.log(response)
            setUser(response.data.UserData)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteReservasi = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/reservasi/delete/${id}`)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const Send = useFormik({
        initialValues: {
            code: ""
        },
        validationSchema: yup.object().shape({
            code: yup.string().required("code is required")
        })
    });

    const submitCode = async () => {
        try {
            const response = await axios.post('http://localhost:3000/reservasi/inquire', {
                code: Send.values.code
            })
            console.log(response)
            setInquire(response.data.reservasiExist)
        } catch (error) {
            console.error("Error response:", error.response);
            setError(error.response.data.message || "An error occurred");
        }
    }

    const AcceptReservasi = async (id) => {
        try {
            console.log(id)
            const response = await axios.delete(`http://localhost:3000/reservasi/accept/${id}`)
            console.log(response)
            window.location.reload()
        } catch (error) {
            console.error("Error response:", error.response);
            setError(error.response.data.message || "An error occurred");
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
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full bg-neutral-100">
                <Topbar />
                <div className="flex justify-center">
                <div className="w-[800px]">

                <div className="flex gap-x-5 mt-10 mb-10 px-5 py-4 bg-white shadow-lg border border-zinc-700 rounded-lg">
                    
                    <form className="w-full" onSubmit={Send.handleSubmit}>
                        <Input
                            placeholder="Masukkan Kode reservasi pelanggan!"
                            type="text"
                            name="code"
                            value={Send.values.code}
                            onChange={Send.handleChange}
                        />
                        <p className="text-sm text-red-500">{Send.errors.code && <>{Send.errors.code}</>}</p>
                    </form>

                    <Dialog>
                        <DialogTrigger onClick={submitCode} className="bg-slate-800 py-2 h-fit px-4 text-white rounded-lg text-sm hover:bg-slate-900 duration-200">Inquire</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-lg">Detail Reservasi</DialogTitle>
                                <div>
                                    <p>Nama : {inquire.nama}</p>
                                    <p>Nama : {inquire.no_meja}</p>
                                    <p>Nama : {inquire.jadwal}</p>
                                    <Button onClick={() => AcceptReservasi(inquire._id)} className="mt-5 w-full">Accept</Button>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
    
                <div className="mt-10 mb-10 px-5 py-5 bg-white shadow-lg border border-zinc-700 rounded-lg">
                    <h1 className="font-bold text-2xl tracking-wide">List Reservasi</h1>
                    <p className="text-sm mb-5 mt-1 text-slate-400">List data reservasi.</p>

                    <form onSubmit={searchData}>
                        <div className="flex">
                            <input
                            type="text"
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-zinc-700"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Nama pemesan / Order ID"
                            />

                            <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                            <button
                            type="submit"
                            className="py-2 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 focus:outline-none duration-200 focus:bg-zinc-700"
                            >
                            Search
                            </button>
                        </div>
                    </form>

                    <Separator className="my-3 bg-zinc-300" />

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-200 text-slate-800">
                                    <th className="py-3 px-4">Nama Reservasi</th>
                                    <th className="py-3 px-4">Nomor Meja</th>
                                    <th className="py-3 px-4">Jadwal Reservasi</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Reservasi ? (
                                Reservasi.map((reservasi) => (
                                    <tr key={reservasi._id} className="border-t border-gray-300">
                                        <td className="py-3 px-4">{reservasi.nama}</td>
                                        <td className="py-3 px-4 font-bold">{reservasi.no_meja}</td>
                                        <td className="py-3 px-4">{formatDate(reservasi.jadwal)}</td>
                                        <td className="py-3 px-4">
                                        <Popover>
                                            <PopoverTrigger className="bg-slate-800 py-2 px-4 text-white rounded-lg text-sm hover:bg-slate-900 duration-200">Detail</PopoverTrigger>
                                            <PopoverContent className="w-[200px] flex flex-col">
                                                <h1 className="text-left font-semibold">Check Details</h1>
                                                <Separator className="mb-2 mt-1 bg-zinc-400" />

                                                <Dialog>
                                                    <DialogTrigger onClick={() => getUser(reservasi.user_id)} className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white duration-200 text-left">Hubungi</DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                        <DialogTitle>Detail Akun</DialogTitle>
                                                        <div>
                                                            <p>Nama : {user.username}</p>
                                                            <p>Email : {user.email}</p>
                                                            <p>No Telp : {user.notelp}</p>
                                                        </div>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-red-500 hover:text-white duration-200 text-left">Batalkan</AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Batalkan Reservasi?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Pembatalan reservasi hanya bisa dilakukan jika waktu sudah lebih dari jadwal reservasi.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteReservasi(reservasi._id)}>Continue</AlertDialogAction>
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
                </div>
                </div>
            </div>
        </div>
    )
}