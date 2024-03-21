import React, { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from 'formik';
import { Link, useNavigate } from "react-router-dom";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Login () {
    const Navigate = useNavigate()
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const [mailerror, setMailerror] = useState("")
    const [success, setSuccess] = useState("")

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("Username is required"),
            password: yup.string().required("Password is required")
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/user/login', {
                    identifier: formik.values.username,
                    password: formik.values.password
                }, {
                    withCredentials: true
                });
                console.log(response)

                if(response.status === 201) {
                    const userInfo = await axios.get('http://localhost:3000/user/user', {
                        withCredentials: true
                    })
                    console.log(userInfo)

                    const roles = userInfo.data.user.role

                    if (roles === 'admin') {
                        Navigate('/dashboard')
                    } else if (roles === 'petugas') {
                        Navigate('/pesanan')
                    } else if (roles === 'customer') {
                        Navigate('/')
                    }

                    if(userInfo.status === 200) {
                        const RefreshToken = await axios.get('http://localhost:3000/user/refresh', {
                            withCredentials: true
                        })
                        console.log(RefreshToken)
                    }
                }
            } catch (error) {
                console.error("Error response:", error.response);
                setError(error.response.data.message || "An error occurred");
            }
        },
    });

    const mail = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: yup.object().shape({
            email: yup.string().required("Email is required")
        }),
        onSubmit: async () => {
            try {
                setLoading(true)
                const response = await axios.post('http://localhost:3000/user/forget', {
                    email: mail.values.email
                })
                console.log(response)
                if(response.status == 200) {
                    setSuccess(response.data.message)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                setMailerror(error.response.data.message)
            }
        }
    })

    return (
        <div className="flex justify-center items-center h-screen bg-neutral-100">
            <div className="border p-10 rounded-lg w-[500px] bg-white shadow-lg">
                <h1 className="text-2xl tracking-wide flex justify-center mb-5 font-bold">Login</h1>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        placeholder="Username or Email Address"
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                    />
                    <p className="text-red-500 text-sm mt-1">{formik.errors.username && <>{formik.errors.username}</>}</p>

                    <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        className="mt-3"
                    />
                    <p className="text-red-500 text-sm mt-1">{formik.errors.password && <>{formik.errors.password}</>}</p>

                    <Separator className="mb-2 bg-zinc-300 mt-5" />

                    <div className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger className="hover:underline">Forget Password</AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Send Email to reset password</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Masukkan email yang sudah terdaftar pada sistem.
                                </AlertDialogDescription>
                                <Input
                                    placeholder="Email"
                                    type="text"
                                    name="email"
                                    value={mail.values.email}
                                    onChange={mail.handleChange}
                                />
                                <p className="text-red-500 text-sm mt-1">{mail.errors.email && <>{mail.errors.email}</>}</p>

                                <p className="text-red-500 text-sm mt-1">{mailerror && <>{mailerror}</>}</p>
                                <p className="text-green-500 text-sm mt-1">{success && <>{success}</>}</p>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                { loading ? (
                                    <Button variant="disabled" >Loading ...</Button>
                                ) : (
                                    <AlertDialogAction onClick={mail.handleSubmit}>Kirim</AlertDialogAction>
                                )}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Link to='/register'>
                            <p className="hover:underline">Don't have account?</p>
                        </Link>
                    </div>

                    {error && <div>{error}</div>}
                    <Button className="w-full mt-10" type="submit">Login</Button>
                </form>
            </div>
        </div>
    );
}  