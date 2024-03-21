import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from 'formik';

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, deleteFromCart, resetCart } from "../store/cartSlice";
import { useNavigate } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input";

import { FaTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

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

export default function Cart () {
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const dialogTriggerRef = useRef(null);

    const dataCartRedux = useSelector((state) => state.cart.value)
    const [ TotalHarga, setTotalHarga ] = useState('0')
    const [ Pending, setPending ] = useState(false)
    const [ PaymentStatus, setPaymentStatus ] = useState('')
    const [ ProductData, setProductData ] = useState([])
    const [ Error, setError ] = useState(null)
    const [ Pemesan, setPemesaan ] = useState("")

    const getProduct = async () => {
        try {
            let validate
            const product = await axios.get(`http://localhost:3000/product/get`)
            setProductData(product.data)
            console.log(product.data)

            dataCartRedux.forEach(cartItem => {
                const productItem = product.data.find(item => item._id === cartItem._id);
                if (productItem && cartItem.quantity > productItem.stock) {
                    validate = "ran out of stock"
                }
            });
            return validate
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        const tokenExist = localStorage.getItem('transactionToken')
        const orderExist = localStorage.getItem('OrderId')

        if(tokenExist && orderExist) {
            setPending(true)
            setPaymentStatus('Menunggu Pembayaran')
            getOrderDetail(orderExist)
        }
        getProduct()
    }, []);

    const getOrderDetail = async (id) => {
        try {
            const OrderData = await axios.get(`http://localhost:3000/order/detail/${id}`)
            console.log(OrderData)
            setPemesaan(OrderData.data.nama_pemesan)
        } catch (error) {
            console.log(error)
        }
    }

    const OrderForm = useFormik({
        initialValues: {
            nama_pemesan: "",
            email: ""
        },
        validationSchema: yup.object().shape({
            nama_pemesan: yup.string().required("Isi nama atas pesanan ini!")
        })
    });

    const onSubmitOrder = async () => {
        try {
            const validateStock = await getProduct();
            console.log(validateStock)

            if (validateStock) {
                console.log('error submit order')
                setError('Mohon periksa kembali pesanan anda.')
                return
            }

            const NoMeja = localStorage.getItem('no_meja')

            console.log('starting order process')
            const orderResponse = await axios.post('http://localhost:3000/order/add', {
                nama_pemesan: OrderForm.values.nama_pemesan,
                no_meja: NoMeja,
                pesanan: dataCartRedux,
            });
            console.log(orderResponse)

            if (orderResponse.status == 201) {
                setPending(true)
                setPaymentStatus('Menunggu Pembayaran')
                
                const OrderId = orderResponse.data.pesanan._id

                const response = await axios.post('http://localhost:3000/order/transaction', {
                    OrderId: OrderId,
                    payload: dataCartRedux,
                    customer: OrderForm.values.nama_pemesan,
                    email: OrderForm.values.email
                });
                console.log(response);

                localStorage.setItem('OrderId', OrderId)
                localStorage.setItem('transactionToken', response.data.token)
                redirectToPayment()

                if (OrderForm.values.email) {
                    const feedback = await axios.post('http://localhost:3000/feedback/send', {
                        orderId: OrderId,
                        email: OrderForm.values.email
                    })
                    console.log(feedback)
                }
            } 
        } catch (error) {
            console.error('Error submitting order:', error);
            // Handle error, e.g., display an error message to the user
        }
    };
    
    const redirectToPayment = () => {
        // Initiate the payment process using Snap
        const storedToken = localStorage.getItem('transactionToken');

        if (storedToken) {
            window.snap.pay(storedToken, {
                onSuccess: async function(result) {
                    localStorage.setItem('email', OrderForm.values.email)
                    console.log('Payment successful:', result);
                    localStorage.removeItem('transactionToken')
                    Navigate('/success')
                    dispatch(resetCart())
                    // Handle success, e.g., navigate to a success page
                },
                onPending: function(result) {
                    console.log('Payment pending:', result);
                    setPending(true)
                    setPaymentStatus('Menunggu Pembayaran')
                    // Handle pending status, e.g., show a pending message to the user
                },
                onError: function(result) {
                    console.error('Payment error:', result);
                    setPending(true)
                    setPaymentStatus('Pembayaran gagal! Coba ulang')
                    // Handle error, e.g., display an error message to the user
                },
                onClose: function() {
                    console.log('Payment modal closed');
                    setPaymentStatus('Menunggu Pembayaran')
                    // Handle modal close event, e.g., refresh the page or navigate to a different page
                }
            });
        } else {
            console.error('No transaction token available');
            // Handle error, e.g., display an error message to the user
        }
    };

    const total = () => {
        let total = 0;
        dataCartRedux.forEach((value) => {
          total += value.harga * value.quantity;
        });
        setTotalHarga(total);
    };

    useEffect(() => {
        total();
    }, [dataCartRedux]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    return (
        <div className="bg-slate-100 h-screen flex flex-col items-center">
            <div className="mb-5">
                <div className="border bg-white shadow-lg border-zinc-400 p-3 m-3 rounded-md sm:w-[500px]">
                    <h1 className="font-bold tracking-wide">Halaman Pembayaran</h1>
                    <p className="text-sm mt-1 mb-3 text-slate-500 italic"><span className="font-bold text-slate-700">Note: </span>Pesanan yang sudah di bayar tidak dapat ditukar atau di kembalikan!</p>

                    { Pending ? (
                    <h1>Pesanan atas nama <span className="font-semibold underline">{Pemesan}</span></h1>
                    ) : (
                    <form onSubmit={OrderForm.handleSubmit}>
                        <Input
                            placeholder="Tulis Nama anda"
                            type="text"
                            name="nama_pemesan"
                            value={OrderForm.values.nama_pemesan}
                            onChange={OrderForm.handleChange}
                            className="border-black shadow-md"
                        />
                        {OrderForm.errors.nama_pemesan && <div>{OrderForm.errors.nama_pemesan}</div>}

                        <Input
                            placeholder="Email untuk feedback (optional)"
                            type="text"
                            name="email"
                            value={OrderForm.values.email}
                            onChange={OrderForm.handleChange}
                            className="border-black mt-3 shadow-md"
                        />
                        {OrderForm.errors.email && <div>{OrderForm.errors.email}</div>}
                    </form>
                    )}

                    {Error ? (
                        <p className="text-red-500 mt-2">{Error}</p>
                    ) : (
                        null
                    )}
                    <Separator className="mb-2 mt-3 bg-zinc-300"/>
                    
                    {dataCartRedux.map((cart, index) => {
                        const productItem = ProductData.find(item => item._id === cart._id);
                        if (!productItem) return null; // Skip if no matching product found
                        return (
                            <div className="mt-5 bg-zinc-50 hover:bg-zinc-200 duration-200 flex p-3 border border-black rounded-md justify-between shadow-md gap-x-5" key={`${cart._id}-${index}`}>
                                <img className="object-cover w-[80px] h-[80px]" src={`http://localhost:9000/appkasir/${cart.gambar}`} alt='Failed to load images' />
                                <div className="mr-auto">
                                    <p className="text-sm font-bold">{cart.nama.length > 30 ? `${cart.nama.slice(0, 30)}...` : cart.nama}</p>
                                    <p className="text-sm text-zinc-800">{formatPrice(cart.quantity * cart.harga)}</p>
                                    <p className="font-bold mt-4">{cart.quantity} x</p>
                                </div>

                                {Pending ? (
                                    null
                                ) : (
                                    <>
                                    {dataCartRedux.find((p) => p._id === productItem._id) && dataCartRedux.find((p) => p._id === productItem._id).quantity > productItem.stock || productItem.stock == 0 ? (
                                        <p className="font-semibold bg-red-500 py-1 px-2 rounded-md text-white h-fit text-sm">Habis</p>
                                    ) : (
                                        null
                                    )}
                                    </>
                                )}

                                {/* product detail pop up */}
                                <Dialog key={`${index}`}>
                                    <DialogTrigger className="mb-auto"><FaRegEdit style={{ width: '20px', height: '20px' }}/></DialogTrigger>
                                    <DialogContent className="w-[350px] md:w-[450px]">
                                        <DialogHeader>
                                            <img className="w-[300px] h-[300px] object-cover mx-auto mt-5" src={`http://localhost:9000/appkasir/${productItem.gambar}`} alt='Failed to load images' />
                                            <div className="mx-auto">
                                                <div className="w-[300px]">
                                                    <DialogTitle className="text-2xl">{productItem.nama}</DialogTitle>
                                                    <DialogDescription className="text-lg text-zinc-800">{productItem.kategori}</DialogDescription>
                                                    <DialogDescription>{productItem.deskripsi}</DialogDescription>
                                                    <Separator className="mb-2 mt-5 bg-zinc-300"/>

                                                    {Pending ? (
                                                        null
                                                    ) : (
                                                        <>
                                                        {dataCartRedux.find((p) => p._id === productItem._id) && dataCartRedux.find((p) => p._id === productItem._id).quantity > productItem.stock || productItem.stock == 0 || cart.quantity == productItem.stock ? (
                                                            <p className="font-semibold bg-red-500 py-1 px-2 rounded-md text-white text-sm w-fit">Habis</p>
                                                        ) : (
                                                            <p className="font-semibold bg-green-500 py-1 px-2 rounded-md text-white text-sm w-fit">Tersedia</p>
                                                        )}
                                                        </>
                                                    )}

                                                    <p className="text-xl font-semibold">{formatPrice(productItem.harga)}</p>

                                                    {/* Id keranjang berdasarkan id product */}
                                                    {dataCartRedux.find((p) => p._id === productItem._id) !== undefined ? (
                                                        <p className="font-semibold">Total: {dataCartRedux.find((p) => p._id === productItem._id).quantity}</p>
                                                    ) : (
                                                        <p className="font-semibold">Total: 0</p>
                                                    )}

                                                    {Pending ? (
                                                        null
                                                    ) : (
                                                        <div className="flex gap-x-3 mt-2">
                                                            {/* validasi stock dari database */}
                                                            {dataCartRedux.find((p) => p._id === productItem._id) && dataCartRedux.find((p) => p._id === productItem._id).quantity > productItem.stock || productItem.stock == 0 || cart.quantity == productItem.stock ? (
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
                                                    )}
                                                </div>
                                            </div>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        );
                    })}
                </div>
            </div>
    
            <>
                {Pending ? (
                    <button onClick={redirectToPayment} className="sticky flex gap-x-20 justify-between mt-auto bottom-4 text-center mx-6 rounded-lg bg-red-500 hover:bg-red-600 duration-200 text-white font-semibold p-4 sm:w-[400px] shadow">
                        <p>{formatPrice(TotalHarga)}</p>
                        <p>Pembayaran</p>
                    </button>
                ):(
                    <button onClick={() => dialogTriggerRef.current.click()} className="sticky flex gap-x-20 justify-between mt-auto bottom-4 text-center mx-6 rounded-lg bg-green-500 hover:bg-green-600 duration-200 text-white font-semibold p-4 sm:w-[400px] shadow">
                        <p>{formatPrice(TotalHarga)}</p>
                        <p>Pesan Sekarang</p>
                    </button>
                )}
            </>

            <AlertDialog>
                <AlertDialogTrigger ref={dialogTriggerRef} />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Melakukan Pesanan?</AlertDialogTitle>
                        <AlertDialogDescription>Apakah anda ingin melakukan pesanan? pesanan yang sudah dilakukan tidak dapat di ubah dan di kembalikan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-200 hover:bg-slate-300">Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-green-500 hover:bg-green-400" onClick={onSubmitOrder}>Pesan Sekarang</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}