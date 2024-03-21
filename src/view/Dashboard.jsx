import React, { useEffect, useState }  from "react";
import axios from "axios";

import Sidebar from "@/layout/sidebar";
import Topbar from "@/layout/topbar";
import UserData from "@/layout/userData";
import TableData from "@/layout/tableData";

function Dashboard () {
    const [user, setUser] = useState("")
    const [table, setTable] = useState("")

    useEffect(() => {
        getUserStatistic();
        getTableStatistic();
    }, []);

    const getUserStatistic = async () => {
        try {
            const response = await axios.get('http://localhost:3000/user/statistic')
            console.log(response)
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTableStatistic = async () => {
        try {
            const response = await axios.get('http://localhost:3000/table/statistic')
            console.log(response)
            setTable(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full bg-neutral-100">
                <Topbar />
                <div className="flex justify-center mt-10">
                    <div>
                        <div className="flex mt-10 justify-between">
                            <div className="border bg-white shadow-lg w-[280px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total user</h1>
                                    <div class="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of all User</p>
                                <p className="font-bold text-2xl">{user.UserCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[280px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total Customer</h1>
                                    <div class="w-3 h-3 bg-orange-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of all Customer</p>
                                <p className="font-bold text-2xl">{user.CustomerCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[280px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total Staff</h1>
                                    <div class="w-3 h-3 bg-blue-500 rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of all Staff</p>
                                <p className="font-bold text-2xl">{user.StaffCount}</p>
                            </div>
                            <div className="border bg-white shadow-lg w-[280px] border-zinc-700 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold">Total Table</h1>
                                    <div class="w-3 h-3 bg-black rounded-full" />
                                </div>
                                <p className="text-sm text-slate-400">Total of the current Table</p>
                                <p className="font-bold text-2xl">{table.TableCount}</p>
                            </div>
                        </div>
                        <div className="flex mt-10 gap-x-20">
                            <UserData />
                            <TableData />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Dashboard