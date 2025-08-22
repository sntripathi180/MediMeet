import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary"
import doctorModel from '../models/doctorModel.js'
import  jwt  from "jsonwebtoken";


//api to add doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    //checking for all the data to add docottr
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email formate
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }
    //hashing dioctor password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary 
    const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
 
    const imageUrl = imageUpload.secure_url

    const doctorData ={
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
    }
//create new object of doverotModel and save to db
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
res.json({success:true,message:"Doctor Added"})

  } catch (error) {
    console.error("Error occured in creating doctor",error);
    res.json({success:false,message:error.message})
  }
};

//api for the admin login

const loginAdmin = async (req,res) => {
  try {
    const {email,password} = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
const token = jwt.sign(email + password,process.env.JWT_SECRET)
res.json({success:true,token})
    }else{
      res.json({success:false,message:"Invalid credentials"})
    }
  } catch (error) {
    console.error(error)
    res.json({success:false,message:error.message})
  }
}


//  api to get all doctor list for admin  panel

const allDoctors = async (req,res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  } catch (error) {
    console.error(error);
    res.json({success:false,message:error.message})
    
  }
}


export { addDoctor ,loginAdmin,allDoctors};
