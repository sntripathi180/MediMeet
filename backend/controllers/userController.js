import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'

//api to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    //hasing the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    //save to db
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Failed to register user", error);
    res.json({ success: false, message: error.message });
  }
};

//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error while User login", error);
    res.json({ success: false, message: error.message });
  }
};

// api to get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // console.log("getProfile - userId from req.body:", userId);
    // console.log("getProfile - full req.body:", req.body);

    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log("Error while getting user profile", error);
    res.json({ success: false, message: error.message });
  }
};

// api to update profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.user.id;
    const imageFile = req.file;
// console.log(imageFile);

    let updateData = {};

    // Only add fields if they are provided
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = JSON.parse(address);
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;

    // If image is uploaded, handle Cloudinary upload
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({ success: false, message: "No data provided to update" });
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error while updating user profile", error);
    res.json({ success: false, message: error.message });
  }
};

//api to book appointment
const bookAppointment = async (req,res) => {
  try {
    const {docId,slotDate,slotTime} = req.body;
     const userId = req.user.id;
    const docData = await doctorModel.findById(docId).select('-password')
if (!docData.available) {
  return res.json({success:false,message:'Doctor not available'})
}
// console.log("docData",docData)
let slots_booked = docData.slots_booked
// console.log("slots_booked",slots_booked);
// console.log("slot data",slotDate)
// console.log("slot time",slotTime);


//checking for sloths availabilityj
if(slots_booked[slotDate]){
  if (slots_booked[slotDate].includes(slotTime)) {
    return res.json({success:false,message:'Slot not available'})
  }else{
    slots_booked[slotDate].push(slotTime)
  }
}else{
  // slots_booked[slotDate].push(slotTime)
  slots_booked[slotDate] = [slotTime]
}


const userData = await userModel.findById(userId).select('-password')
delete docData.slots_booked
const appointmentData  = {
  userId,
  docId,
  userData,
  docData,
  amount:docData.fees,
  slotTime,
  slotDate,
  date:Date.now()
}

const newAppointment = new appointmentModel(appointmentData)
await newAppointment.save()

//save new slots data in docData 
await doctorModel.findByIdAndUpdate(docId,{slots_booked})
res.json({success:true,message:'Appointment booked'})

  } catch (error) {
     console.error("Error while booking appointment", error);
    res.json({ success: false, message: error.message });
  }
}

//api to get user appointement for frontend my-frontend page 
const listAppointement = async (req,res)=>{
  try {
    
    const userId = req.user.id;
    const appointments = await appointmentModel.find({userId})

    res.json({success:true,appointments}) 
  } catch (error) {
    console.log("list appointment",error);
    res.json({success:false,message:error.message})
  }
}


//api to cancel the appointment 
const cancelAppointment =async (req,res) => {
  try {
     const userId = req.user.id;
    const {appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user

    if(appointmentData.userId !== userId){
      return res.json({success:false,message:'Unauthorized action'})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    // releasing doctor slot 
    const {docId,slotDate,slotTime} = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:'Appointment Cancelled'})

  } catch (error) {
    console.log("CancelAppointment",error);
    res.json({success:false,message:error.message})
  }
}

const razorpayInstance = new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})

//api to make payment of appointment using razorpay
const paymentRazorpay = async (req,res) =>{

  try {
    

  const {appointmentId} = req.body
  const appointmentData = await appointmentModel.findById(appointmentId)
  if(!appointmentData || appointmentData.cancelled){
    return res.json({success:false,message:"Appointment Cancelled or not found"})

  }
  // creating options for razorPay payment
  const options ={
    amount: appointmentData.amount*100,
    currency:process.env.CURRENCY,
    receipt:appointmentId

  }
//createionof an order
const order = await razorpayInstance.orders.create(options)
res.json({success:false,message:error.message})

  } catch (error) {
     console.log("PaymentRazorpay",error);
    res.json({success:false,message:error.message})
  }
}
//api to verify the paymont of razorpay
const verifyRazorpay = async (req,res) => {
  try {
    const {razorpay_order_id} = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    // console.log(orderInfo)
    if(orderInfo.status === 'paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:"Payment Successful"})
    }else{
      res.json({success:false,message:"Payment Failed"})
    }

  } catch (error) {
     console.log("VerifyPayment",error);
    res.json({success:false,message:error.message})
  }
}

export { registerUser, loginUser, getProfile, updateProfile,bookAppointment,listAppointement ,cancelAppointment,paymentRazorpay,verifyRazorpay};
