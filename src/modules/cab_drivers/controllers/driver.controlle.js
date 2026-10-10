import { registerUser,sendLoginOtp,verifyLoginOtp } from "../services/userauth.service";
export const registerController = async(req,res)=>
{
    const {userId} = req.user.userid;
    try{
        const{name,email,password,image_url}=req.body
        const user = await registerUser(
            name,email,password,image_url
        )
        return res.status(201).json({success:true,message:"User registered successfully!"})
        
    }
    catch(error)
    {
       return res.status(error.statusCode||500).json({success:false,message:error.message})
    }


}