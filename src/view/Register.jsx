import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import { useFormik } from 'formik';
import { useSelector, useDispatch } from "react-redux";
import { saveRegister } from "@/store/registerSlice";

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

export default function Register2 () {
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    
    const dataRegisterRedux = useSelector((state) => state.register.value)

    useEffect(() => {
        console.log("this is the saved data:", dataRegisterRedux)

        if (dataRegisterRedux) {
            formik.setValues(dataRegisterRedux);
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            email: "",
            notelp: ""
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("Username is required").min(5, "Password must be at least 5 characters long"),
            password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters long"),
            email: yup.string().email().required("Email is required"),
            notelp: yup.number().required("No Telp is required")
        })
    });

    const submitRegister = async () => {
        try {
            setLoading(true)
            dispatch(saveRegister(formik.values));

            const emailResponse = await axios.post('http://localhost:3000/user/send', {
                username: formik.values.username,
                email: formik.values.email
            })
            console.log(emailResponse)

            if(emailResponse.status == 200) {
                setLoading(false)
                Navigate('/verify')
            }    
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(error.response.data.message)
        }
    }

    return (
        <div className="flex bg-neutral-100 h-screen justify-center items-center">
            <div className="border p-10 w-[500px] rounded-lg bg-white shadow-lg">
                <h1 className="text-2xl tracking-wide flex justify-center mb-5 font-bold">Register</h1>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        placeholder="Username"
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
    
                    <Input
                        placeholder="Email"
                        type="text"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className="mt-3"
                    />
                    <p className="text-red-500 text-sm mt-1">{formik.errors.email && <>{formik.errors.email}</>}</p>
    
                    <Input
                        placeholder="No Telp"
                        type="text"
                        name="notelp"
                        value={formik.values.notelp}
                        onChange={formik.handleChange}
                        className="mt-3"
                    />
                    <p className="text-red-500 text-sm mt-1">{formik.errors.notelp && <>{formik.errors.notelp}</>}</p>
    
                    <p className="text-sm text-red-500">{error && <>{error}</>}</p>

                    { loading ? (
                        <Button className="mt-5 w-full" variant="disabled">Loading ...</Button>
                    ) : (
                        <AlertDialog>
                            <AlertDialogTrigger className="p-2 mt-5 w-full bg-zinc-800 rounded-lg text-white">Next</AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Pastikan data yang ditulis sudah benar, dan pastikan email benar karena anda akan menerima kode verifikasi dari email.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={submitRegister}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </form>
            </div>
        </div>
    )
}