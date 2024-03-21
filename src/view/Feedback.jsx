import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StarRatings from 'react-star-ratings';

export default function Feedback () {
    const { token } = useParams()
    const Navigate = useNavigate()
    const [rating, setRating] = useState(0);

    useEffect(() => {
        formik.setFieldValue('rate', rating)
    }, [rating])

    const formik = useFormik({
        initialValues: {
            rate: "",
            feedback: ""
        },
        validationSchema: yup.object().shape({
            rate: yup.string().required("Rate our resto"),
            feedback: yup.string().required("Feedback cant be empty")
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`http://localhost:3000/feedback/add/${token}`, {
                    rate: values.rate,
                    feedback: values.feedback
                })
                if(response.status == 200) {
                    Navigate('/thanks')
                }
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
    });

    return (
        <div className="flex justify-center items-center h-screen bg-neutral-100">
            <div className="border p-10 w-[500px] bg-white shadow-lg">
                <h1 className="text-2xl tracking-wide flex justify-center mb-5 font-bold">Send Feedback</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex justify-center">
                        <StarRatings
                            rating={rating}
                            starRatedColor="blue"
                            numberOfStars={5}
                            name='rating'
                            starDimension="30px"
                            starSpacing="2px"
                            changeRating={(newRating) => setRating(newRating)} // Updating rating state on change
                        />
                    </div>

                    <Input
                        placeholder="Feedback here"
                        type="text"
                        name="feedback"
                        value={formik.values.feedback}
                        onChange={formik.handleChange}
                        className="my-3"
                    />
                    {formik.errors.feedback && <div>{formik.errors.feedback}</div>}

                    <Button className="w-full mt-10" type="submit">Kirim</Button>
                </form>
            </div>
        </div>    
    )
}