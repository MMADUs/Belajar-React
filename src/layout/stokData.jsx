import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import * as yup from "yup";
import { useFormik } from 'formik';
import socket from "@/socket";
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

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input";

export default function StokData () {
    const [Products, setProducts] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [sort, setSort] = useState("")

    useEffect(() => {
        getProducts();
    }, [page, keyword, sort]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        const handleNotification = () => {
            getProducts()
        };

        socket.on('stockupdate', handleNotification);

        return () => {
            socket.off('stockupdate');
        };
    }, []);

    const getProducts = async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await axios.get(`http://localhost:3000/product/stock?search_query=${keyword}&page=${page}&limit=${limit}&sort=${sort}`);
        console.log(response)
        setProducts(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const Update = useFormik({
        initialValues: {
            stock: ""
        },
        validationSchema: yup.object().shape({
            stock: yup.number().required("jumlah stock is required")
        })
    });

    const UpdateStock = async (id) => {
            try {
                const response = await axios.patch(`http://localhost:3000/product/stock/${id}`, {
                    stock: Update.values.stock
                })
                console.log(response)
                window.location.reload();
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
        <div className="w-[650px] mb-10 border p-6 rounded-lg shadow-lg bg-white border-zinc-700">
            <h1 className="font-bold text-2xl tracking-wide">Stock Products</h1>
            <p className="text-sm mb-5 mt-1 text-slate-400">Managment for products stock</p>
        <form onSubmit={searchData}>
            <div className="flex">
                <input
                type="text"
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-zinc-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Nama Produk"
                />

                <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                <DropdownMenu>
                    <DropdownMenuTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Filter</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Filter Stock</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setSort("")}>All</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setSort("least")}>Least</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setSort("most")}>Most</DropdownMenuItem>
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
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Stok</th>
                        <th className="py-3 px-4">Last Update</th>
                        <th className="py-3 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                {Products ? (
                    Products.map((Product) => (
                        <tr key={Product._id} className="border-t border-gray-300">
                            <td className="py-4 px-4 flex items-center gap-x-3">
                                <div className={`w-3 h-3 rounded-full ${Product.stock == 0 ? 'bg-red-500' : Product.stock > 0 ? 'bg-green-500' : ''}`} />
                                <p>{Product.nama}</p>
                            </td>
                            <td className="py-3 px-4 font-bold">{Product.stock}</td>
                            {Product.stock_update === null ? (
                                <td className="py-3 px-4 text-sm">No Update</td>
                            ) : (
                                <td className="py-3 px-4">{formatDate(Product.stock_update)}</td>
                            )}
                            <td className="py-3 px-4">
                                <AlertDialog>
                                    <AlertDialogTrigger className="bg-zinc-800 py-2 px-4 text-white rounded-lg text-sm hover:bg-zinc-900 duration-200">Tambah</AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Tambah stok produk {Product.nama} ?</AlertDialogTitle>
                                            <p className="text-slate-400 text-sm">Masukkan jumlah stok yang ingin di tambahkan.</p>
                                            <form onSubmit={Update.handleSubmit}>
                                                <Input
                                                    placeholder="Tambah stok"
                                                    type="text"
                                                    name="stock"
                                                    value={Update.values.stock}
                                                    onChange={Update.handleChange}
                                                />
                                                {Update.errors.stock && <div>{Update.errors.stock}</div>}
                                            </form>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => UpdateStock(Product._id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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