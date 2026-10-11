import { registerUser,sendLoginOtp,verifyLoginOtp } from "../services/userauth.service.js";
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
export const sendLoginOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        await sendLoginOtp(email);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};


export const loginController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const {
            user,
            accesstoken,
            refreshtoken
        } = await verifyLoginOtp(email, otp);

        res.cookie("refreshToken", refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            accesstoken
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
