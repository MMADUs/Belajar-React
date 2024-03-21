import React from "react"
import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from 'react-router-dom'

//public component
import Home from "./view/Home"
import Login from "./view/Login"
import Menu from "./view/Menu"
import Cart from "./view/Cart"
import DetailOrder from "./view/DetailOrder"
import Register from "./view/Register"
import RegisterCode from "./view/RegisterCode"
import ResetPassword from "./view/ResetPassword"
import Feedback from "./view/Feedback"

//restricted component
import Dashboard from "./view/Dashboard"
import FeedbackList from "./view/FeedbackList"
import History from "./view/history"
import Order from "./view/Order"
import Reservasi from "./view/Reservasi"
import Product from "./view/Product"

//auth component
import ProtectedRoute from "./Auth/RoleAuth"
import IsLogin from "./Auth/isLogin"

//page redirect component
import {
  Error, 
  NotFound, 
  Unpaid,
  Thanks,
  AfterRegister,
  AfterReset
} from "./view/PageRedirect"

function App () {

  return (
    <>
      <Router>
        <Routes>

          <Route path='/' element={<Home />} />

          <Route path='/menu/:id' element={<Menu />} />

          <Route path='/cart' element={<Cart />} />

          <Route path='/success' element={<DetailOrder />} />

          {/* <Route element={<IsLogin />}>
            <Route path='/admin' element={<Login />} />
          </Route> */}

          <Route path='/login' element={<Login />} />

          <Route path='/register' element={<Register />} />

          <Route path='/verify' element={<RegisterCode />} />

          <Route path='/reset/:token' element={<ResetPassword />} />

          <Route path='/feedback/:token' element={<Feedback />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/comment" element={<FeedbackList />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'petugas']} />}>
            <Route path="/history" element={<History />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'petugas']} />}>
            <Route path="/pesanan" element={<Order />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'petugas']} />}>
            <Route path="/reservasi" element={<Reservasi />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/product" element={<Product />} />
          </Route>

          <Route path='/redirect1' element={<AfterRegister />} />

          <Route path='/redirect2' element={<AfterReset />} />

          <Route path='/thanks' element={<Thanks />} />

          <Route path='/unpaid' element={<Unpaid />} />

          <Route path='/error' element={<Error />} />

          <Route path='*' element={<NotFound />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
