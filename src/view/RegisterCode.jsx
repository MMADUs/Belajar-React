import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import * as yup from "yup";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
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
import { Separator } from "@/components/ui/separator"

export default function RegisterCode () {
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const dataRegisterRedux = useSelector((state) => state.register.value)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    const formik = useFormik({
        initialValues: {
            code: ""
        },
        validationSchema: yup.object().shape({
            code: yup.number("must be a Number!").required("Verification code is required")
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                setSuccess("")
                setError("")

                const response = await axios.post('http://localhost:3000/user/register', {
                    username: dataRegisterRedux.username,
                    password: dataRegisterRedux.password,
                    email: dataRegisterRedux.email,
                    notelp: dataRegisterRedux.notelp,
                    verifycode: values.code
                })
                console.log(response)

                if(response.status == 201) {
                    dispatch(saveRegister(null))
                    Navigate('/redirect1')
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                setError(error.response.data.message)
            }
        }
    });

    const resend = async () => {
        try {
            setLoading(true)
            setError("")
            const emailResponse = await axios.post('http://localhost:3000/user/send', {
                username: dataRegisterRedux.username,
                email: dataRegisterRedux.email
            });
            console.log(emailResponse);
            if(emailResponse.status == 200) {
                setSuccess(emailResponse.data.message)
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
            setError(error.response.data.message)
        }
    }

    return (
        <div className="flex bg-neutral-100 h-screen justify-center items-center">
            <div className="border p-10 w-[400px] rounded-lg bg-white shadow-lg">
            <h1 className="text-xl tracking-wide flex justify-center mb-5 font-bold text-center">Verification code has been sent to your Email Address!</h1>
            <form onSubmit={formik.handleSubmit}>
                <Input
                    placeholder="6 Digit Code"
                    type="text"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                />
                <p className="text-sm text-red-500 mt-2">{formik.errors.code && <>{formik.errors.code}</>}</p>

                <p className="text-sm text-red-500 mt-2">{error && <>{error}</>}</p>

                <p className="text-sm text-green-500 mt-2">{success && <>{success}</>}</p>

                { loading ? (
                    <Button className="w-full mt-5">Loading ...</Button>
                ) : (
                    <AlertDialog>
                        <AlertDialogTrigger className="p-2 mt-5 w-full text-sm bg-zinc-800 rounded-lg text-white">Kirim Ulang</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Kirim ulang?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Pastikan email sudah benar, anda dapat mengirim verifikasi setiap 60 detik.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                { loading ? (
                                    <Button className="w-full mt-2 text-md" variant="disabled">Loading ...</Button>
                                ) : (          
                                    <AlertDialogAction onClick={resend}>Continue</AlertDialogAction>
                                )}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                <Separator className="my-3 bg-zinc-300" />

                { loading ? (
                    <Button className="w-full text-md" variant="disabled">Loading ...</Button>
                ) : (
                    <Button className="w-full text-md" type="submit">Submit</Button>
                )}
            </form>
        </div>   
    </div> 
    )
}