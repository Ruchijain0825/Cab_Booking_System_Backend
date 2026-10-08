import { createUser,getUserByEmail,getUser,saveOtp,verifyOtp } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken"
export const registerUser = async(name,email,password,image_url)=>
{
   if(!name||!email||!password)
   {
    const error = new Error("all fields are required");
    error.statusCode = 400;
    throw error;
   }
    if(/\d/.test(name))
    {
        const error = new Error("Name can not contains numbers");
        error.statusCode=400;
        throw error
    }
    
    const correctemailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!correctemailformat.test(email))
    {
       const error =   new Error("Please check the parameter before login");
       error.statusCode = 400;
       throw error;
    }
     const existingemail = await getUserByEmail(email);
    if(existingemail)
    {
        console.log("email is alraedy registered");
       const error = new Error("Email is already registered");
       error.statusCode = 409;
       throw error;

    }
    if(password.length<8)
    {
        const error =  new Error("Please set a strong password");
        error.statusCode = 400;
        throw error
    }
    const password_hash = await bcrypt.hash(password,10);
    const user = await createUser(
        name,
        email,
        password_hash,
        image_url
    )
    return user;
}
export const sendLoginOtp = async(email)=>
{
    const existingemail = await getUserByEmail(email);
    if(!existingemail)
    {
        const error =  new Error("Email is not found");
        error.statusCode = 404;
        throw error;
    }
    const otp_generate = Math.floor(100000 + Math.random()*900000);
    const otp = await bcrypt.hash(String(otp_generate),10);
    const expiresAt = new Date(Date.now()+5*60*1000)
    await saveOtp(
        otp,email,expiresAt
    )
    return otp_generate;
}
export const verifyLoginOtp = async(email,otp)=>
{
    const existingemail = await getUserByEmail(email);
    if (!existingemail) {
        const error = new Error("Email is not found");
        error.statusCode = 404;
        throw error;
    }

    if(!existingemail.otp_expires_at || new Date()>new Date(existingemail.otp_expires_at))
    {
        const error =  new Error("otp is expired");
        error.statusCode = 400;
        throw error;
    }
    const otp_compare = await bcrypt.compare(String(otp),existingemail.otp);
    if(!otp_compare)
    {
        const error= new Error("otp verification failed");
        error.statusCode=400;
        throw error;
    }
    const user = await verifyOtp(email);
    const accesstoken =  jwt.sign({userId:user.id,userName:user.name},process.env.JWT_SECRET,{expiresIn:"1h"})
    const refreshtoken = jwt.sign({userId:user.id,userName:user.name},process.env.JWT_SECRET,{expiresIn:"2d"})
    return {user,accesstoken,refreshtoken}
    

}