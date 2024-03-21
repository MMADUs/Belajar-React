import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { useReactToPrint } from 'react-to-print';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { FaCheckCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";

export default function DetailOrder() {
    const Navigate = useNavigate();
    const [OrderData, setOrderData] = useState(null);
    const [ProductData, setProductData] = useState([]);
    const [TransactionData, setTransactionData] = useState('')
    const [Email, setEmail] = useState("")
    const [pdfSent, setPdfSent] = useState(false);

    const componentPDF = useRef();

    // const generatePDF = () => {
    //     const input = componentPDF.current;
    
    //     html2canvas(input, {
    //         scale: 2,
    //         useCORS: true
    //     }).then(canvas => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'a4');
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = pdf.internal.pageSize.getHeight();
    
    //         // Calculate image dimensions while maintaining aspect ratio
    //         let imgWidth = pdfWidth;
    //         let imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    //         // Check if calculated height exceeds page height and adjust if necessary
    //         if (imgHeight > pdfHeight) {
    //             imgHeight = pdfHeight;
    //             imgWidth = (canvas.width * imgHeight) / canvas.height;
    //         }
    
    //         // Calculate horizontal offset to center the image
    //         const offsetX = (pdfWidth - imgWidth) / 2;
    
    //         pdf.addImage(imgData, 'PNG', offsetX, 0, imgWidth, imgHeight); // Adjust the x-coordinate
    //         pdf.save("download.pdf");
    //     });
    // };

    const generatePDFAndSendToServer = (email) => {
        const input = componentPDF.current;
    
        html2canvas(input, {
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
    
            // Calculate image dimensions while maintaining aspect ratio
            let imgWidth = pdfWidth;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            // Check if calculated height exceeds page height and adjust if necessary
            if (imgHeight > pdfHeight) {
                imgHeight = pdfHeight;
                imgWidth = (canvas.width * imgHeight) / canvas.height;
            }
    
            // Calculate horizontal offset to center the image
            const offsetX = (pdfWidth - imgWidth) / 2;
    
            pdf.addImage(imgData, 'PNG', offsetX, 0, imgWidth, imgHeight); // Adjust the x-coordinate
            
            // Convert the PDF to a Blob
            const pdfBlob = pdf.output('blob');
    
            // Create FormData object and append the PDF Blob
            const formData = new FormData();
            formData.append('file', pdfBlob, 'download.pdf');
            formData.append('email', email);
    
            // Make a POST request to your server endpoint using Axios
            axios.post('http://localhost:3000/order/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                // Handle response from the server
                console.log(response.data);
                setPdfSent(true);
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
        });
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const OrderId = localStorage.getItem('OrderId');
                const isEmail = localStorage.getItem('email')

                if (!OrderId) {
                    return Navigate('/error');
                }
                
                const orderDetail = await axios.get(`http://localhost:3000/order/detail/${OrderId}`);
                setOrderData(orderDetail.data);

                const transactionDetail = await axios.get(`http://localhost:3000/order/transaction/detail/${OrderId}`)
                setTransactionData(transactionDetail.data)
                console.log(transactionDetail)
    
                // Extract product IDs from OrderData.pesanan
                const productIds = orderDetail.data.pesanan.map(item => item.productId);
                const productResponses = await Promise.all(
                    productIds.map(productId => axios.get(`http://localhost:3000/product/detail/${productId}`))
                );
                const products = productResponses.map(response => response.data);
                setProductData(products);
                setEmail(isEmail)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [Navigate]); // Removed OrderData from dependencies array

    useEffect(() => {
        if (OrderData && ProductData && TransactionData && Email && !pdfSent) {
            generatePDFAndSendToServer(Email);
            setPdfSent(true)
            setEmail("")
            localStorage.removeItem('email');
        }
    }, [OrderData, ProductData, TransactionData, Email]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    if (!OrderData || !ProductData || !TransactionData) {
        return <h1>Loading Data</h1>;
    }

    const formatDate = (date) => {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }

    return (
        <div className="flex justify-center h-screen">
            <div className="w-full sm:w-[500px]" ref={componentPDF}>

                <div>
                    <div className="border m-5 border-black p-5 pb-10 rounded-lg shadow-lg bg-white">
                        <div className="flex justify-center"><FaCheckCircle style={{ width: '50px', height: '50px' }} /></div>
                        <h1 className="mt-3 text-xl text-center font-bold tracking-wide">Payment Successful!</h1>
                        <p className="text-center text-sm text-slate-500">Please wait for the order to arrive</p>
                        <Separator className="my-3 bg-zinc-400"/>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">ID</p>
                            <p>{TransactionData.transaksi_id}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Nama Pemesan</p>
                            <p>{OrderData.nama_pemesan}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Nomor Meja</p>
                            <p>{OrderData.no_meja}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Order ID</p>
                            <p>{TransactionData.order_id}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Tipe Pembayaran</p>
                            <p>{TransactionData.tipe_pembayaran}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Status Pmebayaran</p>
                            <p>{TransactionData.status_pembayaran}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Total Amount</p>
                            <p>{formatPrice(TransactionData.total)}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                            <p className="font-semibold">Waktu Pembayaran</p>
                            <p>{formatDate(TransactionData.waktu_pembayaran)}</p>
                        </div>
                    </div>
                        
                    <div className="border m-5 border-black p-5 rounded-lg shadow-lg bg-white">
                        <h1 className="font-semibold">Detail Pesanan</h1>
                        {OrderData.pesanan.map((Order, index) => {
                            const product = ProductData.find(product => product._id === Order.productId);
                            return (
                                <div className="" key={index}>
                                    <Separator className="my-2 bg-zinc-400"/>
                                    {product && (
                                        <div className="flex gap-x-3 justify-between">
                                            <img className="object-cover h-[70px] w-[70px]" src={`http://localhost:9000/appkasir/${product.gambar}`} alt='Failed to load images' />
                                            <div className="mr-auto">
                                                <p className="text-sm font-semibold">{product.nama}</p>
                                                <p className="text-sm text-slate-700">{formatPrice(product.harga)}</p>
                                            </div>
                                            <p className="mr-3 mt-3 font-bold">{Order.quantity} x</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
