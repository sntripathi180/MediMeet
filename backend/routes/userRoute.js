import express from 'express'

import { registerUser,loginUser, getProfile, updateProfile, bookAppointment, listAppointement, cancelAppointment, paymentRazorpay } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
//upload is coming froom muluter middleware
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)

userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointement)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)

export default userRouter