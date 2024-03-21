import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, deleteFromCart } from "../store/cartSlice";

import { FaTrashCan } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Menu () {
    const { id } = useParams()
    const Navigate = useNavigate()
    const [ ProductData, setProductData ] = useState([])
    const [ TotalHarga, setTotalHarga ] = useState('0')
    const [ Search, setSearch ] = useState('')
    const [ Credential, setCredential ] = useState(null)

    const dispatch = useDispatch()

    const dataCartRedux = useSelector((state) => state.cart.value)
    console.log(dataCartRedux)

    const categories = ['makanan', 'minuman', 'snack'];

    useEffect(() => {
        const transaction = localStorage.getItem('transactionToken')
        if (transaction) {
            Navigate('/unpaid')
        }
    }, []);

    useEffect(() => {
        const pageCredential = async () => {
            try {          
                const tableData = await axios.get(`http://localhost:3000/table/detail/${id}`)
                console.log(tableData)
                const data = await tableData.data.no_meja

                setCredential(data)
                localStorage.setItem('no_meja', data)
            } catch (error) {
                console.error('Error fetching data:', error);
                localStorage.removeItem('no_meja')
                setCredential(false)
            }
        }
        pageCredential()
    },[id])

    useEffect(() => {
        const getProduct = async () => {
            try {
                const product = await axios.get(`http://localhost:3000/product/get?search=${Search}`)
                setProductData(product.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getProduct()
    }, [Search]);

    const total = () => {
        let total = 0;
        dataCartRedux.forEach((value) => {
            total += value.harga * value.quantity;
        });
        setTotalHarga(total);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    useEffect(() => {
        total();
    }, [dataCartRedux]);

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    if (Credential === null) {
        // Loading here
        return <h1>Loading</h1>;
    }

    if (Credential === false) {
        // Redirect to error
        return Navigate('/*')
    }

    return (
        <div>
            <div className="sticky top-0 bg-white border-b shadow-md flex justify-center gap-x-18 md:gap-x-[200px] lg:gap-x-[400px]">
                <Sheet>
                    <SheetTrigger>
                        <div className="p-2 m-2 border border-zinc-400 rounded-lg">
                            <FaShoppingCart style={{ width: '20px', height: '20px' }}/>
                        </div>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="font-bold tracking-normal text-left">Keranjang Pesanan</SheetTitle>
                            <div className="flex flex-col h-screen">
                                <div className="overflow-y-auto">
                                    <div className="mb-24">
                                {dataCartRedux.length === 0 ? (
                                            <div>Tidak ada item.</div>
                                        ) : (
                                            dataCartRedux.map((cart, index) => (
                                                <div key={index}>
                                                    <Separator className="my-3 bg-zinc-600"/>
                                                    <div className="flex gap-x-5 items-center">
                                                        <img className="object-cover w-20 h-20" src={`http://localhost:9000/appkasir/${cart.gambar}`} alt='Failed to load images' />
                                                        <div className="text-left">
                                                            <p className="text-black font-semibold text-md">{cart.nama}</p>
                                                            <p className="text-sm">{formatPrice(cart.harga)}</p>
                                                            <p className="text-black font-bold mt-2">{cart.quantity} x</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <button className="sticky flex justify-between mt-auto bottom-4 text-center rounded-lg bg-green-500 hover:bg-green-600 duration-200 text-white font-semibold p-4 shadow" onClick={() => Navigate('/cart')}>
                                    <p>{dataCartRedux.length} items</p>
                                    <p>{formatPrice(TotalHarga)}</p>
                                </button>                          
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <div className="flex">
                    <Input 
                    type="text" 
                    placeholder= "Cari Menu"
                    value={Search} 
                    onChange={handleInputChange}
                    className="w-[200px] m-2 border-zinc-400"
                    />
                    <button className="p-2 bg-white border border-zinc-400 rounded-lg my-auto"><IoIosSearch style={{ width: '20px', height: '20px', color: 'black' }}/></button>
                </div>
            </div>

            <div className="flex justify-center">
                <main>
                    {categories.map((category, index) => {
                    // Filter product data based on the current category
                    const filteredProducts = ProductData.filter(product => product.kategori === category);

                    // Check if there are any products for the current category
                    if (filteredProducts.length === 0) {
                        return null; 
                    }
                    // Skip rendering the category if there are no products

                    return (
                        <div key={`${index}`}>
                            <h1 className="mt-10 uppercase text-xl font-bold">{category}</h1>
                            <Separator className="mb-2 mt-3 bg-zinc-500"/>

                            <div className="w-full mt-8 flex justify-center">
                                <div className="flex flex-wrap justify-start items-center w-[340px] md:w-[520px] lg:w-[790px] gap-5">
                                    {filteredProducts.map((productItem, index) => (
                                            <Card className="flex flex-col w-[160px] h-[350px] md:h-[440px] md:w-[250px] border-zinc-600" key={`${index}`}>
                                                <CardHeader>
                                                    {ProductData.length !== 0 ? (
                                                        <div className="px-3">
                                                            <img className="w-full object-cover h-[130px] md:h-[200px]" src={`http://localhost:9000/appkasir/${productItem.gambar}`} alt='Failed to load images' />
                                                            <CardTitle className="text-lg md:text-2xl mt-2 whitespace-normal">{productItem.nama}</CardTitle>
                                                            <CardDescription className="text-md">{productItem.kategori}</CardDescription>
                                                        </div>
                                                    ) : (
                                                        <div>LOADING</div>                                                   
                                                    )}
                                                </CardHeader>
                                                <CardFooter className="gap-x-5 mt-auto">
                                                    {/* validasi stock dari database */}
                                                    {dataCartRedux.find((p) => p._id === productItem._id) && dataCartRedux.find((p) => p._id === productItem._id).quantity == productItem.stock || productItem.stock == 0 ? (
                                                        <p className="font-semibold bg-red-500 py-1 px-2 rounded-md text-white text-sm w-fit">Habis</p>
                                                    ) : (
                                                        <p className="font-semibold bg-green-500 py-1 px-2 rounded-md text-white text-sm w-fit">Tersedia</p>
                                                    )}

                                                    <p className="mt-1 mb-1 text-lg font-semibold">{formatPrice(productItem.harga)}</p>

                                                    {/* product detail pop up */}
                                                    <Dialog>
                                                        <DialogTrigger className="border py-2 w-full rounded-md font-semibold text-white bg-zinc-800 hover:bg-zinc-900 duration-300">Detail</DialogTrigger>
                                                        <DialogContent className="w-[350px] md:w-[450px]">
                                                            <DialogHeader>
                                                                <img className="w-[300px] h-[300px] object-cover mx-auto mt-5" src={`http://localhost:9000/appkasir/${productItem.gambar}`} alt='Failed to load images' />
                                                                <div className="mx-auto">
                                                                    <div className="w-[300px]">
                                                                        <DialogTitle className="text-2xl">{productItem.nama}</DialogTitle>
                                                                        <DialogDescription className="text-lg text-zinc-800">{productItem.kategori}</DialogDescription>
                                                                        <DialogDescription>{productItem.deskripsi}</DialogDescription>

                                                                        <Separator className="mb-2 mt-5 bg-zinc-300"/>
                                                                        
                                                                        {/* validasi stock dari database */}
                                                                        {dataCartRedux.find((p) => p._id === productItem._id) && dataCartRedux.find((p) => p._id === productItem._id).quantity == productItem.stock || productItem.stock == 0 ? (
                                                                            <p className="font-semibold bg-red-500 py-1 px-2 rounded-md text-white text-sm w-fit">Habis</p>
                                                                        ) : (
                                                                            <p className="font-semibold bg-green-500 py-1 px-2 rounded-md text-white text-sm w-fit">Tersedia</p>
                                                                        )}
                                                                        <p className="text-xl font-semibold">{formatPrice(productItem.harga)}</p>

                                                                        {/* Id keranjang berdasarkan id product */}
                                                                        {dataCartRedux.find((p) => p._id === productItem._id) !== undefined ? (
                                                                            <p className="font-semibold">Total: {dataCartRedux.find((p) => p._id === productItem._id).quantity}</p>
                                                                        ) : (
                                                                            <p className="font-semibold">Total: 0</p>
                                                                        )}

                                                                        <div className="flex gap-x-3 mt-2">
                                                                            {/* validasi stock dari database */}
                                                                            {dataCartRedux.find((p) => p._id === productItem._id) && dataCartRedux.find((p) => p._id === productItem._id).quantity == productItem.stock || productItem.stock == 0 ? (
                                                                                <>
                                                                                    <Button disabled onClick={() => dispatch(addToCart(productItem))} className="bg-green-500 hover:bg-green-400" variant="default">Tambah</Button>
                                                                                    <Button onClick={() => dispatch(removeFromCart(productItem))} className="mr-auto" variant="destructive">Hapus</Button>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Button onClick={() => dispatch(addToCart(productItem))} className="bg-green-500 hover:bg-green-400" variant="default">Tambah</Button>
                                                                                    <Button onClick={() => dispatch(removeFromCart(productItem))} className="mr-auto" variant="destructive">Hapus</Button>
                                                                                </>
                                                                            )}

                                                                            {/* pop up hapus semua barang */}
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger className="bg-red-500 px-3 rounded-lg text-white hover:bg-red-600 duration-300"><FaTrashCan /></AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>Hapus semua?</AlertDialogTitle>
                                                                                        <AlertDialogDescription>Apakah anda ingin menghapus semua barang ini dari keranjang?</AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel className="bg-slate-200 hover:bg-slate-300">Batal</AlertDialogCancel>
                                                                                        <AlertDialogAction className="bg-red-500 hover:bg-red-400" onClick={() => dispatch(deleteFromCart(productItem))}>Hapus</AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )
                    })}    
                </main>
            </div>
        </div>
    )
}