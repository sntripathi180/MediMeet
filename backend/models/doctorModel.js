import mongoose from "mongoose";

const doctorSchmea = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    },
    degree:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    fees:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    date:{
        type:Number,
        required:true,
    },
    slots_booked:{
        type:Object,
        default:{}
    }
},{minimize:false})
//minimize false to create an empty obj as done in slot_booked 


const doctorModel = mongoose.models.doctor || mongoose.model('doctor',doctorSchmea);
//this is done to keep sure that the app does keep on creating model every time if the app start 

export default doctorModel;