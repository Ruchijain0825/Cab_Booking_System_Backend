import {registerUser,loginUser,getAvailability,
  changeAvailability,} from "../services/driver.service.js"
export const registerController = async(req,res)=>
{
    
    try{
         const user = await registerUser(req.body)
        return res.status(201).json({success:true,message:"Driver registered successfully!",user})
        
    }
    catch(error)
    {
         console.error("Registration failed:", error.message);
  console.error("PostgreSQL error code:", error.code);
  console.error("Detail:", error.detail);
  console.error("Where:", error.where);

       return res.status(error.statusCode||500).json({success:false,message:error.message})
    }
}
export const loginController = async(req,res)=>
{
    try{

    
    const{email,password,licence_number}=req.body;

   const { user, accesstoken, refreshtoken } = await loginUser({
            email,
            password,
            licence_number
        });
        
        res.cookie("refreshToken", refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            user,
            accesstoken,
            refreshtoken
        });
    }
    catch(error)
    {
        return res.status(error.statusCode||500).json({success:false,message:error.message})
    }
}
export const getAvailabilityController = async (req, res, next) => {
  try {
    const driver = await getAvailability(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        is_online: driver.is_online,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailabilityController = async (req, res, next) => {
  try {
    const driver = await changeAvailability(
      req.user.userId,
      req.body.isOnline
    );

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: {
        is_online: driver.is_online,
      },
    });
  } catch (error) {
    next(error);
  }
};