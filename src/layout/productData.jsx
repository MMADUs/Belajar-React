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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input";

export default function ProductData () {
    const [Products, setProducts] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(6);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("")
    const [error, setError] = useState("");
    const [formCategory, setFormCategory] = useState("")
    const [updateCategory, setUpdateCategory] = useState("")

    useEffect(() => {
        getProducts();
    }, [page, keyword, category]);

    useEffect(() => {
        Create.setFieldValue('kategori', formCategory)
    }, [formCategory]);

    useEffect(() => {
        Update.setFieldValue('kategori', updateCategory)
    }, [updateCategory]);

    const getProducts = async () => {
        const response = await axios.get(`http://localhost:3000/product/get/query?search_query=${keyword}&page=${page}&limit=${limit}&category=${category}`);
        console.log(response)
        setProducts(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/product/delete/${id}`)
            console.log(response)
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    const getProductById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/product/detail/${id}`)
            console.log(response)
            Update.setValues(response.data)
            setUpdateCategory(response.data.kategori)
        } catch (error) {
            console.log(error)
        }
    }

    const Create = useFormik({
        initialValues: {
            nama: "",
            deskripsi: "",
            kategori: "",
            harga: "",
            file: ""
        },
        validationSchema: yup.object().shape({
            nama: yup.string().required("nama is required"),
            deskripsi: yup.string().required("deskripsi is required"),
            kategori: yup.string().required("kategori is required"),
            harga: yup.number().required("harga is required in rupiah")
        }),
        onSubmit: async (values, { setError }) => {
            try {
                const formData = new FormData();

                formData.append('nama', values.nama);
                formData.append('deskripsi', values.deskripsi);
                formData.append('kategori', values.kategori);
                formData.append('harga', values.harga);
                formData.append('file', values.file);
    
                const response = await axios.post('http://localhost:3000/product/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response);
                window.location.reload();
            } catch (error) {
                console.error("Error response:", error.response);
                setError(error.response.data.message || "An error occurred");
            }
        }
    });

    const Update = useFormik({
        initialValues: {
            nama: "",
            deskripsi: "",
            kategori: "",
            harga: "",
            file: ""
        },
        validationSchema: yup.object().shape({
            nama: yup.string().required("nama is required"),
            deskripsi: yup.string().required("deskripsi is required"),
            kategori: yup.string().required("kategori is required"),
            harga: yup.number().required("harga is required in rupiah")
        })
    });

    const updateProduct = async (id) => {
        try {
            const formData = new FormData();

            formData.append('nama', Update.values.nama);
            formData.append('deskripsi', Update.values.deskripsi);
            formData.append('kategori', Update.values.kategori);
            formData.append('harga', Update.values.harga);
            formData.append('file', Update.values.file);

            const response = await axios.put(`http://localhost:3000/product/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    return (
                <div className="w-[620px] mb-10 border border-zinc-700 p-6 rounded-lg shadow-lg bg-white">
                    <h1 className="font-bold text-2xl tracking-wide">Products</h1>
                    <p className="text-sm mb-5 mt-1 text-slate-400">Managment for product data</p>
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

                            <AlertDialog>
                                <AlertDialogTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Add</AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Add Product</AlertDialogTitle>
                                        <Separator className="bg-slate-400" />

                                        <form onSubmit={Create.handleSubmit}>
                                            <Input
                                                placeholder="Nama produk"
                                                type="text"
                                                name="nama"
                                                value={Create.values.nama}
                                                onChange={Create.handleChange}
                                                className="mt-3 border-zinc-400"
                                            />
                                            <p className="text-red-500 text-sm mt-1">{Create.errors.nama && <>{Create.errors.nama}</>}</p>

                                            <Input
                                                placeholder="Deskripsi"
                                                type="text"
                                                name="deskripsi"
                                                value={Create.values.deskripsi}
                                                onChange={Create.handleChange}
                                                className="mt-3 border-zinc-400"
                                            />
                                            <p className="text-red-500 text-sm mt-1">{Create.errors.deskripsi && <>{Create.errors.deskripsi}</>}</p>

                                            <Select value={formCategory} onValueChange={setFormCategory}>
                                                <SelectTrigger className="w-full mt-3 border-zinc-400">
                                                    { formCategory ? (
                                                        <SelectValue placeholder={formCategory} />
                                                    ) : (
                                                        <SelectValue placeholder="Kategori" />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="makanan">Makanan</SelectItem>
                                                    <SelectItem value="minuman">Minuman</SelectItem>
                                                    <SelectItem value="snack">Snack</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-red-500 text-sm mt-1">{Create.errors.kategori && <>{Create.errors.kategori}</>}</p>

                                            <Input
                                                placeholder="Harga"
                                                type="text"
                                                name="harga"
                                                value={Create.values.harga}
                                                onChange={Create.handleChange}
                                                className="mt-3 border-zinc-400"
                                            />
                                            <p className="text-red-500 text-sm mt-1">{Create.errors.harga && <>{Create.errors.harga}</>}</p>

                                            <Input
                                                id="file"
                                                name="file"
                                                type="file"
                                                onChange={(event) => Create.setFieldValue("file", event.currentTarget.files[0])}
                                                className="mt-3 border-zinc-400 hover:bg-zinc-200 duration-100 cursor-pointer"
                                            />
                                            <p className="text-red-500 text-sm mt-1">{Create.errors.file && <>{Create.errors.file}</>}</p>

                                            {error && <div>{error}</div>}
                                        </form>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="border-black">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={Create.handleSubmit}>Tambah</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Separator orientation="vertical" className="h-10 mx-3 bg-zinc-400" />

                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-sm border border-zinc-800 py-2 px-4 rounded-lg">Filter</DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Filter Kategori</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setCategory("")}>All</DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setCategory("makanan")}>Makanan</DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setCategory("minuman")}>Minuman</DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => setCategory("snack")}>Snack</DropdownMenuItem>
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
                        <div className="w-full text-left flex flex-col gap-y-5">
                            {Products ? (
                                Products.map((Product) => (
                                    <div key={Product._id} className="border flex justify-between gap-x-10 px-3 py-2 rounded-lg shadow-lg border-gray-400">
                                        <img className="object-cover w-[80px] h-[80px]" src={`http://localhost:9000/appkasir/${Product.gambar}`} alt='Failed to load images' />
                                        <div className="mr-auto">
                                            <p className="font-semibold">{Product.nama}</p>
                                            <p className="mt-2 text-sm text-slate-600">{Product.kategori}</p>
                                        </div>

                                        <p className="">{formatPrice(Product.harga)}</p>
                                        
                                        <Popover>
                                            <PopoverTrigger className="bg-zinc-800 py-2 px-4 text-white rounded-lg text-sm hover:bg-zinc-900 duration-200 h-fit">Detail</PopoverTrigger>
                                            <PopoverContent className="flex flex-col w-[150px]">
                                                <h1 className="text-left font-semibold">Details</h1>
                                                <Separator className="mb-2 mt-1 bg-zinc-400" />

                                                {/* detail produk */}
                                                <Dialog>
                                                    <DialogTrigger className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-slate-200 duration-200 text-left">Detail</DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle className="font-semibold tracking-wide text-lg">Detail produk</DialogTitle>
                                                            <div>
                                                                <Separator className="bg-zinc-500" />
                                                                <img className="object-cover w-full mt-3 h-[300px]" src={`http://localhost:9000/appkasir/${Product.gambar}`} alt='Failed to load images' />
                                                                <p className="text-lg mt-3 font-bold">{Product.nama}</p>
                                                                <p className="text-md">{Product.kategori}</p>
                                                                <p className="text-sm text-slate-500">{Product.deskripsi}</p>
                                                                <p className="font-semibold">{formatPrice(Product.harga)}</p>
                                                                <div className="my-2 bg-blue-500 w-fit p-2 text-sm text-white rounded-lg">Tersisa {Product.stock} Stock</div>
                                                                {Product.stock_update === null ? (
                                                                    <p className="text-sm text-slate-500">Stok Belum pernah di update.</p>
                                                                ) : (
                                                                    <p className="text-sm text-slate-500">Stock Updated {formatDate(Product.stock_update)}</p>
                                                                )}
                                                                <p className="text-sm text-slate-500">Dibuat Pada {formatDate(Product.createdAt)}</p>
                                                                <p className="text-sm text-slate-500">Last Updated {formatDate(Product.updatedAt)}</p>
                                                            </div>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Edit Table */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger onClick={() => getProductById(Product._id)} className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white duration-200 text-left">Edit</AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Edit Produk</AlertDialogTitle>
                                                            <form onSubmit={Update.handleSubmit}>
                                                                <Input
                                                                    placeholder="Nama produk"
                                                                    type="text"
                                                                    name="nama"
                                                                    value={Update.values.nama}
                                                                    onChange={Update.handleChange}
                                                                    className="mt-3 border-zinc-400"
                                                                />
                                                                {Update.errors.nama && <div>{Update.errors.nama}</div>}

                                                                <Input
                                                                    placeholder="Deskripsi"
                                                                    type="text"
                                                                    name="deskripsi"
                                                                    value={Update.values.deskripsi}
                                                                    onChange={Update.handleChange}
                                                                    className="mt-3 border-zinc-400"
                                                                />
                                                                {Update.errors.deskripsi && <div>{Update.errors.deskripsi}</div>}

                                                                <Select value={updateCategory} onValueChange={setUpdateCategory}>
                                                                    <SelectTrigger className="w-full mt-3 border-zinc-400">
                                                                        { formCategory ? (
                                                                            <SelectValue placeholder={updateCategory} />
                                                                        ) : (
                                                                            <SelectValue placeholder="Kategori" />
                                                                        )}
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="makanan">Makanan</SelectItem>
                                                                        <SelectItem value="minuman">Minuman</SelectItem>
                                                                        <SelectItem value="snack">Snack</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                {Update.errors.kategori && <div>{Update.errors.kategori}</div>}

                                                                <Input
                                                                    placeholder="Harga"
                                                                    type="text"
                                                                    name="harga"
                                                                    value={Update.values.harga}
                                                                    onChange={Update.handleChange}
                                                                    className="mt-3 border-zinc-400"
                                                                />
                                                                {Update.errors.harga && <div>{Update.errors.harga}</div>}

                                                                <Input
                                                                    id="file"
                                                                    name="file"
                                                                    type="file"
                                                                    onChange={(event) => Update.setFieldValue("file", event.currentTarget.files[0])}
                                                                    className="mt-3 border-zinc-400"
                                                                />
                                                                {Update.errors.file && <div>{Update.errors.file}</div>}

                                                                {error && <div>{error}</div>}
                                                            </form>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => updateProduct(Product._id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                {/* delete Table */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger className="bg-white py-2 px-2 rounded-lg text-sm hover:bg-red-500 hover:text-white duration-200 text-left">Delete</AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah anda yakin ingin menghapus data Produk ini?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => deleteProduct(Product._id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </PopoverContent>
                                        </Popover>  
                                    </div>
                                ))
                            ) : (
                                (Array.from({ length: 10 }).map((_, index) => (
                                    <div key={index}>
                                        <div colSpan="6" className="py-3 px-4">
                                            <Skeleton className="py-5 px-6 bg-slate-200" />
                                        </div>
                                    </div>
                                )))
                            )}
                        </div>
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