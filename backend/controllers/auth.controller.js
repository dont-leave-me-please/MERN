import { User } from "../models/user.model.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail } from "../mailtrap/email.js";

// ✅ Signup controller
export const signup = async (req, res) => {
  //function declaration, (req, res) → Express passes two objects:,
  const { email, password, name } = req.body; //Get user input //This destructures data from the request body.

  //When the frontend sends a signup form (like JSON {email, password, name}), these values are extracted from req.body.

  try {
    if (!email || !password || !name) {
      //Checks if any field is missing
      throw new Error("All fields are required"); //If one is missing, it throws an error, which will be caught later in the catch block.
    }

    const userAlreadyExists = await User.findOne({ email }); //Uses Mongoose’s findOne() to look up a user with the same email in MongoDB.
    if (userAlreadyExists) {
      //If a user is found, respond with 400 (Bad Request) and a message — the signup process stops here.
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10); //encrypts the password before saving.10 → salt rounds (how many times to process the password for extra security).The hashed version will be stored in the database — not the plain password (important for security).

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000 //Creates a 6-digit verification code (random number between 100000 and 999999). Converts it to a string — often sent to the user via email to verify their account.
    ).toString();

    const user = new User({
      //Creates a new document based on your Mongoose model
      email,
      password: hashedPassword,
      name,
      verificationToken, //the 6-digit code
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // sets expiry time to 24 hours from now
    });

    await user.save(); //Saves the new user document into MongoDB. await ensures it waits until the saving process finishes.

    // ✅ use the response object, not req
    generateTokenAndSetCookie(res, user._id);
    //This likely creates a JWT (JSON Web Token) that includes the user’s ID
    //The function sets it in a cookie on the res object.
    //Purpose: automatically log in the user after signup and keep them authenticated.
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        //user → user data, but with the password hidden (password: undefined)
        ...user._doc, //user._doc → the raw MongoDB document (used to spread all user fields into the response)
        password: undefined,
      },
    });
  } catch (error) {
    //If any step inside try fails (e.g. DB error, missing field), it jumps here.
    res.status(400).json({ success: false, message: error.message }); //Sends an error response with a 400 status and a readable error message
  }
};

// ✅ Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 3️⃣ Compare password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 4️⃣ Generate token
    generateTokenAndSetCookie(res, user._id);

    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Logout controller
export const logout = async (req, res) => {
  try {
    // 🧩 1. Clear the authentication cookie (token)
    res.clearCookie("token", {
      httpOnly: true, // same as when you set it
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // 🧩 2. Send success response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // 🧩 3. Handle unexpected errors
    console.error("❌ Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while logging out",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // ❗ Return after sending response to stop execution
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // ✅ Fixed "Data" typo

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URI}/reset-password/${resetToken}`
    );

    // ✅ Use 200 for success, not 400
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
