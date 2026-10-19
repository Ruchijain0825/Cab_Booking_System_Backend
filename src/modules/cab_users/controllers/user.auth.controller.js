
import {
  registerUser,
  loginUser
} from "../services/userauth.service.js";

// REGISTER CONTROLLER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, image_url } = req.body;

    const user = await registerUser(
      name,
      email,
      password,
      image_url
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to create account"
    });
  }
};

// LOGIN CONTROLLER
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const {
      user,
      accesstoken,
      refreshtoken
    } = await loginUser(email, password);

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
    console.error("Login error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
};
