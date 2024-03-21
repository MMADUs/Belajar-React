import React,{ useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export function Error () {
    return (
        <div className="flex  flex-col justify-center items-center h-screen text-center">
            <h1 className="font-bold text-2xl tracking-wide">YOU DONT HAVE ACCESS TO THE PAGE</h1>
            <p>Please Login to access the page.</p>
            <Link to='/login'>
                <Button className="mt-5 w-40">Login</Button>
            </Link>
        </div>
    )
}

export function Unpaid () {
    return (
        <div className="flex  flex-col justify-center items-center h-screen text-center">
            <h1 className="font-bold text-2xl tracking-wide">BACK TO PAYMENT PAGE</h1>
            <p>Finish your on going payment.</p>
            <Link to='/cart'>
                <Button className="mt-5 w-40">Back to Payment</Button>
            </Link>
        </div>
    )
}

export function NotFound () {
    return (
        <div className="flex  flex-col justify-center items-center h-screen">
            <h1 className="font-bold text-2xl tracking-wide">404 Not Found</h1>
            <p>The url you're looking for can't be found.</p>
            <Link to={-1}>
                <Button className="mt-5 w-40">Back</Button>
            </Link>
        </div>
    )
}

export function Thanks () {
    return (
        <div className="flex  flex-col justify-center items-center h-screen text-center">
            <h1 className="font-bold text-2xl tracking-wide">Thank you!</h1>
            <p>Terimakasih sudah memberikan feedback.</p>
        </div>
    )
}

export function AfterRegister () {
    const Navigate = useNavigate()

    useEffect(() => {
        const delayTime = 3000; // Delay time in milliseconds

        const delayedAction = () => {
            Navigate('/login')
        };

        const timeoutId = setTimeout(delayedAction, delayTime);
        return () => clearTimeout(timeoutId);
    }, [])

    return (
        <div className="flex  flex-col justify-center items-center h-screen text-center">
            <h1 className="font-bold text-2xl tracking-wide">Account Created!</h1>
            <p className="mt-3">You will be redirected to the login page.</p>
        </div>
    )
}

export function AfterReset () {
    const Navigate = useNavigate()

    useEffect(() => {
        const delayTime = 3000; // Delay time in milliseconds

        const delayedAction = () => {
            Navigate('/login')
        };

        const timeoutId = setTimeout(delayedAction, delayTime);
        return () => clearTimeout(timeoutId);
    }, [])

    return (
        <div className="flex  flex-col justify-center items-center h-screen text-center">
            <h1 className="font-bold text-2xl tracking-wide">Password changed!</h1>
            <p className="mt-3">You will be redirected to the login page.</p>
        </div>
    )
}