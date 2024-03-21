import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from 'formik';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword () {
    const { token } = useParams()
    const Navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const formik = useFormik({
        initialValues: {
            newpassword: "",
            cpassword: ""
        },
        validationSchema: yup.object().shape({
            newpassword: yup.string().required("New Password is required").min(5, "Password must be at least 5 characters long"),
            cpassword: yup.string().required("Confirm Password is required")
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const response = await axios.patch(`http://localhost:3000/user/change/${token}`, {
                    newpassword: values.newpassword,
                    cpassword: values.cpassword
                })
                console.log(response)

                if(response.status == 200) {
                    Navigate('/redirect2')
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                setError(error.response.data.message)
            }
        }
    });
    
    return (
        <div className="h-screen flex justify-center bg-neutral-100 items-center">
            <div className="border p-10 rounded-lg bg-white shadow-lg w-[500px]">
                <h1 className="text-2xl mb-10 flex justify-center font-bold tracking-wide">Reset Password</h1>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        placeholder="New Password"
                        type="password"
                        name="newpassword"
                        value={formik.values.newpassword}
                        onChange={formik.handleChange}
                    />
                    <p className="text-red-500 text-sm mt-1">{formik.errors.newpassword && <>{formik.errors.newpassword}</>}</p>

                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        name="cpassword"
                        value={formik.values.cpassword}
                        onChange={formik.handleChange}
                        className="mt-3"
                    />
                    <p className="text-red-500 text-sm mt-1">{formik.errors.cpassword && <>{formik.errors.cpassword}</>}</p>

                    <p className="text-red-500 text-sm mt-1">{error && <>{error}</>}</p>

                    { loading ? (
                        <Button className="w-full mt-10" variant="disabled">Loading ...</Button>
                    ) : (
                        <Button className="w-full mt-10" type="submit">Change Password</Button>
                    )}
                </form>
            </div>
        </div>    
    )
}