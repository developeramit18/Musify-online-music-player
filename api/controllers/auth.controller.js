import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errorHandler.js';
// import {redis} from '../lib/redis.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.EmailUser,
      pass: process.env.EmailPass,
    },
  });

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || name === '' || email === '' || password === '') {
        return next(errorHandler(400, "All fields are required!"));
    }

    if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'))
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return next(errorHandler(406, 'User already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        playlists: []
    });
    try {
        await newUser.save();

        // await redis.del("totalUsers");
        // await redis.del("lastMonthUsers");

        const user = await UserModel.findOne({ email })
        .select('name isAdmin liked_songs')
        .populate({
            path: "liked_songs", 
            options: { sort: { createdAt: -1 } }, 
            populate: {
              path: "artist",
            },
          });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.status(201).json({user, message:"User created successfully"});
    } catch (err) {
        next(err);        
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, "All fields are required!"));
    }

    try {

        const validUser = await UserModel.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(406, "Invalid email or password!"));
        }

        const user = await UserModel.findOne({ email })
        .select('name isAdmin liked_songs')
        .populate({
            path: "liked_songs", 
            options: { sort: { createdAt: -1 } }, 
            populate: {
              path: "artist",
            },
          });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({user, message:"SignIn success"});

    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async(req,res,next) =>{
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
    
        if (!user){
            return next(errorHandler(404, "User not found!!!"))
        }
    
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 600000;
    
        await user.save();
    
        // Send email with reset link
        const resetLink = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;
        await transporter.sendMail({
          to: email,
          subject: "Reset your password for musify",
          html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 10 minutes.</p>`,
        });
    
        res.status(200).json({ message: "Password reset link sent to your email!" });
      } catch (error) {
        next(error)
        console.log(error)
      }
}

export const resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      const user = await UserModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
  
      if (!user) return next(errorHandler(400, "Invalid or expired token!"));
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
  
      await user.save();
  
      const updatedUser = await UserModel.findById(user._id)
      .select("name isAdmin liked_songs")
        .populate({
          path: "liked_songs",
          options: { sort: { createdAt: -1 } },
          populate: { path: "artist" },
        })
        
  
      const newToken = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.cookie("access_token", newToken, {
        httpOnly: false, 
        secure: true, 
        maxAge: 24 * 60 * 60 * 1000, 
      });
  
      res.status(200).json({
        message: "Password reset successfully!",
        token: newToken,
        user: updatedUser,
      });
    } catch (error) {
      next(error);
      console.log(error)
    }
  };
  
  

export const checkLogin = async(req,res,next) =>{
    try {
        return res.status(200).json(req.id)
    } catch (error) {
        next(error);
    }
}

export const signout = (_, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json("User has been signed out")
    } catch (error) {
        next(error)
    }
}

