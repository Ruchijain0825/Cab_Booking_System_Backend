import { createUser,getUserByEmail} from "../models/user.model.js";
import bcrypt  from "bcrypt";
import jwt from  "jsonwebtoken"
export const registerUser = async()=>
{
    
    const{name,email,vehicle_number,licence_number,vehicle_type,password,phone_number,image_url}=req.body;
   if(!name||!email||!vehicle_number||!licence_number||!vehicle_type||!password||!phone_number)
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
    const licence_hash = await bcrypt.hash(licence_number,10)
    const user = await createUser(
        name,
        email,
        vehicle_number,
        licence_number,
        vehicle_type,
        password_hash,
        licence_hash,
        phone_number,
        image_url ?? null
    );
    
    return user
   
}
export const loginUser = async()=>
{
    
   
        const{email,password,licence_number}=req.body;
        if(!email||!password||!licence_number)
        {
            const error = new Error("Unfilled credentials");
            error.statusCode=400;
            return error
        };
        const user = await getUserByEmail(email);
        if(!user)
        {
            const error = new Error("Email is not found");
            error.statusCode = 400;
            return error;
        }
        const comparepassword = await bcrypt.compare(password,user.password_hash);
        if(!comparepassword)
        {
            const error = new Error("invalid credentials");
            error.statusCode = 400;
            return error;
        }
        const comaparelicence = await bcrypt.compare(licence_number,user.licence_number);
        if(!comaparelicence)
        {
            const error = new Error("invalid credentials");
            error.statusCode =  400;
            throw error;
        }
         const accesstoken =  jwt.sign({userId:user.id,userName:user.name},process.env.JWT_SECRET,{expiresIn:"1h"})
            const refreshtoken = jwt.sign({userId:user.id,userName:user.name},process.env.REFRESH_SECRET,{expiresIn:"2d"})

           return {user,accesstoken,refreshtoken}
       
    
     
}