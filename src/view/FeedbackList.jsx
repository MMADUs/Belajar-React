import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import moment from "moment";

import Sidebar from "@/layout/sidebar";
import Topbar from "@/layout/topbar";

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";

import StarRatings from 'react-star-ratings';

export default function FeedbackList () {
    const [Feedback, setFeedback] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [statistic, setStatistic] = useState("")

    useEffect(() => {
        getFeedback();
        getStatistic()
    }, [page, keyword]);

    const getFeedback = async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await axios.get(`http://localhost:3000/feedback/get?search_query=${keyword}&page=${page}&limit=${limit}`);
        console.log(response)
        setFeedback(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const getStatistic = async () => {
        try {
            const response = await axios.get('http://localhost:3000/feedback/statistic')
            console.log(response)
            setStatistic(response.data)
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
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full bg-neutral-100">
                <Topbar />
                <div className="flex justify-center">
                <div>

                <div className="flex mt-10 justify-between">
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Low Rate</h1>
                                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total rate from 1 - 2</p>
                                <p className="font-bold text-2xl">{statistic.lowFeedback}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Decent Rate</h1>
                                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total rate from 3 - 4</p>
                                <p className="font-bold text-2xl">{statistic.goodFeedback}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Good rate</h1>
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total rate with 5</p>
                                <p className="font-bold text-2xl">{statistic.highFeedback}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[250px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total Feedback</h1>
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the feedback</p>
                                <p className="font-bold text-2xl">{statistic.totalFeedback}</p>
                            </div>
                        </div>
    
                <div className="w-[1200px] mt-10 mb-10 px-5 py-5 bg-white shadow-lg border border-zinc-700 rounded-lg">
                    <h1 className="font-bold text-2xl tracking-wide">List Feedback</h1>
                    <p className="text-sm mb-5 mt-1 text-slate-400">List data feedback untuk setiap pesanan.</p>

                    <form onSubmit={searchData}>
                        <div className="flex">
                            <input
                            type="text"
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-zinc-700"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Email"
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
                                    <th className="py-3 px-4">ID Pesanan</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Tanggal</th>
                                    <th className="py-3 px-4">Feedback</th>
                                    <th className="py-3 px-4">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Feedback ? (
                                Feedback.map((feedback) => (
                                    <tr key={feedback._id} className="border-t border-gray-300">
                                        <td className="py-3 px-4">{feedback.order_id}</td>
                                        <td className="py-3 px-4">{feedback.email}</td>
                                        <td className="py-3 px-4">{formatDate(feedback.createdAt)}</td>
                                        <td className="py-3 px-4">{feedback.feedback}</td>
                                        <td className="py-3 px-2 w-[140px]">
                                        <StarRatings
                                            rating={feedback.rate}
                                            starRatedColor="blue"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
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