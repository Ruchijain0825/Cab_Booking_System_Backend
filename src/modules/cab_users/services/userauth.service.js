
import {
  createUser,
  getUserByEmail
} from "../models/user.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (
  name,
  email,
  password,
  image_url
) => {
  if (!name?.trim() || !email?.trim() || !password) {
    const error = new Error(
      "Name, email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  if (/\d/.test(name)) {
    const error = new Error(
      "Name cannot contain numbers"
    );
    error.statusCode = 400;
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    const error = new Error(
      "Please enter a valid email address"
    );
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error(
      "Password must contain at least 8 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    const error = new Error(
      "Email is already registered"
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUser(
    name,
    email,
    passwordHash,
    image_url
  );

  return user;
};

// LOGIN USER WITH EMAIL AND PASSWORD
export const loginUser = async (email, password) => {
  if (!email?.trim() || !password) {
    const error = new Error(
      "Email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  email = email.trim().toLowerCase();

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    existingUser.password_hash
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const payload = {
    userId: existingUser.id,
    userName: existingUser.name
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  const user = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    image_url: existingUser.image_url
  };

  return {
    user,
    accesstoken: accessToken,
    refreshtoken: refreshToken
  };
};
