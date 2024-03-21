import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductData from "@/layout/productData";
import StokData from "@/layout/stokData";
import Topbar from "@/layout/topbar";
import Sidebar from "@/layout/sidebar";

export default function Product () {
    const [statistic, setStatistic] = useState("")

    useEffect(() => {
        getStatistic();
    }, []);

    const getStatistic = async () => {
        try {
            const response = await axios.get('http://localhost:3000/product/statistic')
            console.log(response)
            setStatistic(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full h-screen overflow-y-auto bg-neutral-100">
                <div className="sticky top-0">
                    <Topbar />
                </div>
                <div className="flex justify-center mt-10">
                    <div>
                        <div className="flex justify-between">
                            <div className="border bg-white shadow-lg w-[300px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total Products</h1>
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the current Products</p>
                                <p className="font-bold text-2xl">{statistic.ProductCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[300px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Available Stock</h1>
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total Products with available stock</p>
                                <p className="font-bold text-2xl">{statistic.AvailableStock}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[300px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Ran Out Stock</h1>
                                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total Products Ran out of stock</p>
                                <p className="font-bold text-2xl">{statistic.LeastStock}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[300px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total Category</h1>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the Products Category</p>
                                <p className="font-bold text-2xl">3</p>
                            </div>
                        </div>
                        <div className="flex mt-10 gap-x-20">
                            <ProductData />
                            <StokData />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}