import React, { useState, useEffect, useRef } from "react"
import axios from "axios";
import * as yup from "yup";
import { useFormik } from 'formik';
import { Link } from "react-router-dom";
import moment from "moment";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { FaCircleUser } from "react-icons/fa6";

import picture from "@/assets/notfound.jpg"
import picture1 from "@/assets/food1.jpg"
import picture2 from "@/assets/restaurant1.jpg"
import picture3 from "@/assets/restaurant2.jpg"

export default function Home() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [meja, setMeja] = useState("")
  const [dataMeja, setDataMeja] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [reservasi, setReservasi] = useState("");
  const [User, setUser] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitloading, setSubmitloading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const userInfo = await axios.get('http://localhost:3000/user/user', {
          withCredentials: true
        })
        const roles = userInfo.data.user.role;
        console.log(roles)
        setIsAuthorized(roles);
        setUser(userInfo.data.user)

        if (roles == 'customer') {
          const reservasi = await axios.post('http://localhost:3000/reservasi/detail', {
            userId: userInfo.data.user._id
          })
          console.log(reservasi)
          setReservasi(reservasi.data.reservasi)
        }
        setLoading(false)
        
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthorized(false);
        setLoading(false)
      }
    };

    checkAuthorization();
  }, []);

  const Logout = async () => {
    try {
        const response = await axios.get('http://localhost:3000/user/logout', {
            withCredentials: true
        })

        if (response.status == 200) {
          window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
  }

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  useEffect(() => {
    Reservasi.setFieldValue('no_meja', meja)
  }, [meja]);

  useEffect(() => {
    console.log(reservasi)
  }, [reservasi]);

  useEffect(() => {
    if (date && time) {
      const formattedDate = new Date(date).toLocaleDateString();
      const formattedTime = new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false});
  
      const mergedDateTime = `${formattedDate}, ${formattedTime}`;
      Reservasi.setFieldValue('jadwal', mergedDateTime)
      console.log(mergedDateTime);
      return
    }
    console.log('input data!')
  }, [date, time]);

  useEffect(() => {
    getTable()
  }, [])

  const getTable = async () => {
    try {
      const response = await axios.get('http://localhost:3000/table/all')
      console.log(response)
      setDataMeja(response.data.allTable)
    } catch (error) {
      console.log(error)
    }
  }

  const Reservasi = useFormik({
    initialValues: {
        nama: "",
        no_meja: "",
        jadwal: ""
    },
    validationSchema: yup.object().shape({
        nama: yup.string().required("nama is required"),
        no_meja: yup.string().required("no meja is required"),
        jadwal: yup.string().required("jadwal is required")
    }),
    onSubmit: async (values) => {
      try {
        setSubmitloading(true)
        const response = await axios.post('http://localhost:3000/reservasi/add', values, {
          withCredentials: true
        });
        console.log(response);

        if(response.status == 200) {
          setSubmitloading(false)
          window.location.reload()
        }
      } catch (error) {
        console.log(error);
        setSubmitloading(false)
        setError(error.response.data.message)
      }
    }
  });

  const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  }
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-10">
        <div className="w-[500px] flex flex-col rounded-lg h-[500px]">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold text-2xl tracking-wide">Reservasi Meja</h1>
              <p className="text-sm mb-3 mt-1 text-slate-400">Reservasi meja untuk dine in.</p>
            </div>
            
            { isAuthorized == 'customer' ? (
              <AlertDialog>
                <AlertDialogTrigger className="hover:underline h-fit">Log out</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ingin Log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ketika melakukan log out, anda perlu login lagi.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={Logout}>Log out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              null
            )}
          </div>

          { loading ? (
            <h1>Loading</h1>
            ) : (
            (reservasi ? (
              <div className="flex flex-col h-full">
                <Separator className="bg-zinc-400 mb-5 w-full" />
                <h1 className="font-bold tracking-wide text-lg">Data Reservasi</h1>
                <div className="mt-5 flex justify-between">
                  <h1>Nama Reservasi</h1>
                  <p>{reservasi.nama}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <h1>Nomor Meja</h1>
                  <p>{reservasi.no_meja}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <h1>Jadwal Reservasi</h1>
                  <p>{formatDate(reservasi.jadwal)}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <h1>Created at</h1>
                  <p>{formatDate(reservasi.createdAt)}</p>
                </div>
                <Separator className="bg-zinc-400 mt-8 mb-5 w-full" />
                <h1 className="font-bold tracking-wide text-lg">Data Pengguna</h1>
                <div className="mt-5 flex justify-between">
                  <h1>Nama Account</h1>
                  <p>{User.username}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <h1>Kode reservasi di kirim ke</h1>
                  <p>{User.email}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <h1>Nomor yang akan dihubungi</h1>
                  <p>{User.notelp}</p>
                </div>
                <h1 className="mt-4 text-sm text-slate-600">Di tunggu kehadiran di resto kami tepat waktu.</h1>
              </div>
            ) : (
              ( isAuthorized == 'customer' ? (
                <>
                <form onSubmit={Reservasi.handleSubmit}>
                  <Input
                    placeholder="Nama"
                    type="text"
                    name="nama"
                    value={Reservasi.values.nama}
                    onChange={Reservasi.handleChange}
                  />
                  <p className="text-sm text-red-500">{Reservasi.errors.nama && <>{Reservasi.errors.nama}</>}</p>
                </form>
    
                  <Select value={meja} onValueChange={setMeja}>
                    <SelectTrigger className="mt-3">
                      { meja ? (
                        <SelectValue placeholder={meja} />
                      ) : (
                        <SelectValue placeholder="Nomor Meja" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                    {dataMeja && dataMeja.map((meja) => (
                      <SelectItem key={meja._id} value={`${meja.no_meja}`}>{meja.no_meja}</SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
    
                  <p className="text-sm text-red-500">{Reservasi.errors.no_meja && <>{Reservasi.errors.no_meja}</>}</p>
    
                  <Popover>
                    <PopoverTrigger className="border py-2 px-3 text-left mt-3">
                      { Reservasi.values.jadwal ? (
                        <p>{Reservasi.values.jadwal}</p>
                      ) : (
                        <p>Pilih Jadwal</p>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px]">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border border-black"
                      />
                      <Input 
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="border-black mt-5"
                      />
                    </PopoverContent>
                  </Popover> 
    
                  <p className="text-sm text-red-500">{Reservasi.errors.jadwal && <>{Reservasi.errors.jadwal}</>}</p>
    
                <AlertDialog>
                  <AlertDialogTrigger onClick={() => setError("")}  className="bg-zinc-800 text-white py-2 rounded-lg mt-auto">Submit</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Pastikan data reservasi benar.</AlertDialogTitle>
                      <AlertDialogDescription>
                        data reservasi tidak dapat diubah setelah melakukan reservasi.
                      </AlertDialogDescription>
                      <p className="text-sm text-red-500">{error && <>{error}</>}</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      { submitloading ? (
                        <Button variant="disabled">Loading ...</Button>
                      ) : (
                        <AlertDialogAction onClick={Reservasi.handleSubmit}>Submit</AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </>
              ) : (
                <>
                  <h1 className="mt-auto">Login untuk melakukan reservasi.</h1>
                  <Link to="/login">
                    <Button className="w-full mt-5">Login Here</Button>
                  </Link>
                </>
              ))    
            ))

          )}
        </div>

        <div className="w-[500px] h-[500px] rounded-lg flex flex-col">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
              }),
          ]}>
            <CarouselContent>
              <CarouselItem className="">
                <div>
                  <img src={picture1} className="w-full h-[400px] object-cover" alt="" />
                </div>
              </CarouselItem>
              <CarouselItem className="">
                <div>
                  <img src={picture2} className="w-full h-[400px] object-cover" alt="" />
                </div>
              </CarouselItem>
              <CarouselItem className="">
                <div>
                  <img src={picture3} className="w-full h-[400px] object-cover" alt="" />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          <Separator className="bg-zinc-400 mt-auto" />

          <Button className="w-full mt-auto tracking-wide text-md">Lihat denah meja resto</Button>
          </div>
      </div>
    </div>
  )
}