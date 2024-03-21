import React from "react";
import { useState, useEffect, useRef } from 'react';
import socket from "@/socket";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from 'sonner';

export default function Notification () {
    const dialogTriggerRef = useRef(null);
    const [notificationData, setNotificationData] = useState("");

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        const handleNotification = (data) => {
            console.log(data);
            showNotification(data);
            setNotificationData(data);
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification');
        };
    }, []);

    const showNotification = (data) => {
        toast(`${data.dataOrder.nama_pemesan} Has Paid the Orders`, {
            description: `${data.FinishedTransaction.waktu_pembayaran}`,
            action: {
                label: "Detail",
                onClick: () => {
                    dialogTriggerRef.current.click();
                }
            }
        })
    };

    return (
        <>
            <Dialog>
                <DialogTrigger ref={dialogTriggerRef} />
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Notifikasi Terbaru</DialogTitle>
                        {notificationData && (
                            <div>
                                <h1>{notificationData.dataOrder._id}</h1>
                                <p>Name: {notificationData.dataOrder.nama_pemesan}</p>
                                <p>Total: {notificationData.FinishedTransaction.total}</p>
                                <p>Type: {notificationData.FinishedTransaction.tipe_pembayaran}</p>
                                <p>Payment Time: {notificationData.FinishedTransaction.waktu_pembayaran}</p>
                                <p>{notificationData.FinishedTransaction.status_pembayaran}</p>
                            </div>
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}