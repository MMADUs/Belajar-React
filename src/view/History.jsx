import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/layout/sidebar";
import Topbar from "@/layout/topbar";
import ReactPaginate from "react-paginate";
import socket from "@/socket";
import moment from "moment";

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
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";

export default function History () {
    const [orders, setOrders] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("finished")
    const [product, setProduct] = useState([])
    const [transaction, setTransaction] = useState("")
    const [statistic, setStatistic] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [user, setUser] = useState("")

    useEffect(() => {
        getOrders();
        getStatistic();
    }, [page, keyword, status]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        const handleNotification = () => {
            getOrders()
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification');
        };
    }, []);

    const getOrders = async () => {
        console.log(status)
        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await axios.get(`http://localhost:3000/order/get?search_query=${keyword}&page=${page}&limit=${limit}&status=${status}`);
        console.log(response)
        setOrders(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const getProduct = async (data) => {
        // Extracting product IDs and quantities from the array parameter
        const productsData = await Promise.all(
            data.map(async (item) => {
                const productId = item.productId;
                const quantity = item.quantity;
                const response = await axios.get(`http://localhost:3000/product/detail/${productId}`);
                const productData = response.data;
                return { ...productData, quantity }; // Adding quantity to product data
            })
        );
        setProduct(productsData);
    };

    const getStatistic = async () => {
        try {
            const response = await axios.get('http://localhost:3000/order/history/statistic')
            console.log(response)
            setStatistic(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTransaction = async (id) => {
        console.log(id)
        try {
            const response = await axios.get(`http://localhost:3000/order/transaction/detail/${id}`)
            console.log(response)
            setTransaction(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getReport = async () => {
        if (!month || !year) {
            return console.log('isi data!')
        }

        try {
            const response = await axios.post('http://localhost:3000/order/report', {
                month: month, // Replace with the desired month
                year: year, // Replace with the desired year
            }, {
                responseType: 'arraybuffer', // Tell Axios to expect a binary response
            });

            console.log(response)
    
            // Create a blob object from the response data
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
    
            // Create a link element, set its href attribute, and trigger a click event to download the Excel file
            const link = document.createElement('a');
            link.href = url;
            link.download = 'report.xlsx';
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };
    
    return (
        <div className="flex h-screen bg-neutral-100">
            <Sidebar />
            <div className="w-full bg-neutral-100">
                <Topbar />
                <div className="flex justify-center">
                    <div>
                        <div className="flex mt-10 justify-between">
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Failure Payment</h1>
                                    <div class="w-3 h-3 bg-red-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the failure payment</p>
                                <p className="font-bold text-2xl">{statistic.FailureCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Unpaid Payment</h1>
                                    <div class="w-3 h-3 bg-orange-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the Unpaid payment</p>
                                <p className="font-bold text-2xl">{statistic.PendingCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Settlement Payment</h1>
                                    <div class="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the Settlement payment</p>
                                <p className="font-bold text-2xl">{statistic.SettlementCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Finished Orders</h1>
                                    <div class="w-3 h-3 bg-green-700 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the Finished orders</p>
                                <p className="font-bold text-2xl">{statistic.FinishedCount}</p>
                            </div>
                        </div>

                        <div className="w-[1200px] p-6 mt-8 shadow-lg bg-white border border-zinc-700 rounded-lg">
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="font-bold text-2xl tracking-wide">History Pesanan</h1>
                                    <p className="text-sm mb-5 mt-1 text-slate-400">Displaying all data pesanan</p>
                                </div>

                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger className="w-[180px] ml-auto border-black">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Januari</SelectItem>
                                        <SelectItem value="2">Februari</SelectItem>
                                        <SelectItem value="3">Maret</SelectItem>
                                        <SelectItem value="4">April</SelectItem>
                                        <SelectItem value="5">Mei</SelectItem>
                                        <SelectItem value="6">Juni</SelectItem>
                                        <SelectItem value="7">Juli</SelectItem>
                                        <SelectItem value="8">Agustus</SelectItem>
                                        <SelectItem value="9">September</SelectItem>
                                        <SelectItem value="10">Oktober</SelectItem>
                                        <SelectItem value="11">November</SelectItem>
                                        <SelectItem value="12">Desember</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Select value={year} onValueChange={setYear}>
                                    <SelectTrigger className="w-[180px] ml-3 border-black">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                    </SelectContent>
                                </Select>

                                <AlertDialog>
                                    <AlertDialogTrigger className="bg-slate-800 ml-3 py-3 px-5 h-fit text-white rounded-lg text-sm hover:bg-slate-900 duration-200">Generate Laporan</AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Generate laporan?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Generate laporan dengan excel dan pastikan memilih bulan dan tahun yang sesuai.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={getReport}>Generate</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

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

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Filter</DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Filter status</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => { setStatus("finished"); }}>Finished</DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => { setStatus("unpaid"); }}>Unpaid</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

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
                                            <th className="py-3 px-4">ID Pesanan</th>
                                            <th className="py-3 px-4">Nama Pemesan</th>
                                            <th className="py-3 px-4">No Meja</th>
                                            <th className="py-3 px-4">Status Pesanan</th>
                                            <th className="py-3 px-4">Pesanan Dibuat</th>
                                            <th className="py-3 px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {orders ? (
                                        orders.map((order) => (
                                            <tr key={order._id} className="border-t border-gray-300">
                                                <td className="py-3 px-4">{order._id}</td>
                                                <td className="py-3 px-4">{order.nama_pemesan}</td>
                                                <td className="py-3 px-4">{order.no_meja}</td>
                                                <td className="py-3 px-4">
                                                    <div className={`text-sm text-white w-fit py-1 px-2 rounded-md font-semibold ${order.status_pesanan === 'unpaid' ? 'bg-red-500' : order.status_pesanan === 'pending' ? 'bg-orange-500' : order.status_pesanan === 'finished' ? 'bg-green-500' : ''}`}>
                                                        {order.status_pesanan}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{formatDate(order.createdAt)}</td>
                                                <td className="py-3 px-4">
                                                <Popover>
                                                    <PopoverTrigger className="bg-slate-800 py-2 px-4 text-white rounded-lg text-sm hover:bg-slate-900 duration-200">Detail</PopoverTrigger>
                                                    <PopoverContent className="flex flex-col w-[200px]">
                                                        <h1 className="text-left font-semibold">Check Details</h1>
                                                        <Separator className="mb-2 mt-1 bg-zinc-400" />

                                                        <Sheet>
                                                            <SheetTrigger onClick={() => getProduct(order.pesanan)}  className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-slate-200 duration-200 text-left">Detail Pesanan</SheetTrigger>
                                                            <SheetContent>
                                                                <SheetHeader>
                                                                    <SheetTitle>Detail Pesanan</SheetTitle>
                                                                    <div className="flex flex-col h-screen">
                                                                        <div className="overflow-y-auto">
                                                                            <div className="mb-24">
                                                                                {product.map((detail, index) => (
                                                                                    <div key={index}>
                                                                                        <Separator className="my-3 bg-zinc-600"/>
                                                                                        <div className="flex gap-x-5 items-center">
                                                                                            <img className="object-cover w-20 h-20" src={`http://localhost:9000/appkasir/${detail.gambar}`} alt='Failed to load images' />
                                                                                            <div className="text-left">
                                                                                                <p className="text-black font-semibold text-md">{detail.nama}</p>
                                                                                                <p className="text-black font-bold mt-2">{detail.quantity} x</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SheetHeader>
                                                            </SheetContent>
                                                        </Sheet>

                                                        {/* detail transaksi */}
                                                        <Dialog>
                                                            <DialogTrigger onClick={() => getTransaction(order._id)} className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-slate-200 duration-200 text-left">Detail Transaksi</DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                <DialogTitle className="font-bold tracking-wide text-lg">Detail Transaksi</DialogTitle>
                                                                <Separator className="mb-2 mt-1 bg-zinc-400" />
                                                                {transaction ? (
                                                                    <div>
                                                                        <div className="flex justify-between">
                                                                            <p>ID Order</p>
                                                                            <p>{transaction.order_id}</p>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <p>ID Transaksi</p>
                                                                            {transaction.transaksi_id === null ? (
                                                                                <p>Transaksi belum di proses</p>
                                                                            ) : (
                                                                                <p>{transaction.transaksi_id}</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <p>Tipe Pembayaran</p>
                                                                            {transaction.tipe_pembayaran === null ? (
                                                                                <p>Transaksi belum di proses</p>
                                                                            ) : (
                                                                                <p>{transaction.tipe_pembayaran}</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <p>Total Amount</p>
                                                                            <p>{formatPrice(transaction.total)}</p>
                                                                        </div>
                                                                        {transaction.status_pembayaran === null ? (
                                                                            <p className="bg-red-500 py-1 mt-2 px-2 w-fit text-white text-sm rounded-lg">Transaksi belum di proses</p>
                                                                        ) : (
                                                                            <p className="font-semibold mt-2"><span className={`w-fit py-1 text-sm px-3 text-white rounded-lg ${transaction.status_pembayaran === 'pending' ? 'bg-orange-500' : transaction.status_pembayaran === 'settlement' ? 'bg-green-500' : transaction.status_pembayaran === 'failure' ? 'bg-red-500' : ''}`}>{transaction.status_pembayaran}</span></p>
                                                                        )}

                                                                        {transaction.waktu_pembayaran === null ? (
                                                                            <p className="mt-3">Pesanan belum dibayar!</p>
                                                                        ) : (
                                                                            <p className="mt-3">{formatDate(transaction.waktu_pembayaran)}</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <h1>Loading</h1>
                                                                )}
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Dialog>
                                                            <DialogTrigger onClick={() => getUser(order.id_penerima)} className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white duration-200 text-left">Penerima</DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                <DialogTitle>Detail Akun Penerima</DialogTitle>
                                                                <div>
                                                                    <p>Nama : {user.username}</p>
                                                                    <p>Email : {user.email}</p>
                                                                    <p>No Telp : {user.notelp}</p>
                                                                </div>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>
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