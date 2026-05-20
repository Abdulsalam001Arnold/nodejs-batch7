
import { userModel } from "../models/userModel.js"
import { validateSignup, validateLogin } from "../validator/userValidator.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"


export const getHome = (req, res) => {
    res.send("This is the home route.")
}

export const postUser = async (req, res) => {
    const {username, email, password} = req.body
    try {
        const { error } = validateSignup.validate({
            username,
            email,
            password
        })

        if(error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const existingUser = await userModel.findOne({email})
        if(existingUser) {
         return res.status(400).json({
             message: "User already exist, please login instead.",
             data: existingUser
         })
        }
     
        const newUser = await userModel.create({
         username,
         email,
         password
        })

        const token = await generateToken(newUser._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
     
        return res.status(201).json({
         message: "User created successfully!",
         data: newUser
        })
    } catch (error) {
        console.error(err)
        throw new Error(err)
    }
}



export const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const { error } = validateLogin.validate({
            email,
            password
        })

        if(error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const existingUser = await userModel.findOne({email})

        if(!existingUser) {
         return res.status(400).json({
             message: "User not found, please signup instead.",
         })
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = await generateToken(existingUser._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "User logged in successfully!",
            data: existingUser
        })
    } catch (error) {
        console.error(err)
        throw new Error(err)
    }
}


export const getSingleUser = async (req, res) => {
    const { id } = req.params

    try{
       const user = await userModel.findById(id).select("-password")

       if(!user) {
        return res.status(404).json({
            message: "User does not exist" 
        })
       }

       return res.status(200).json({
        message: "Data fetched successfully",
        data: user
       })
    }catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

export const getAll = async (req, res) => {
    try {
        const users = await userModel.find().sort({createdAt: -1}).select("-password")

        if(!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            })
        }

        return res.status(200).json({
            message: "Users fetched",
            data: users
        })
    }catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
      const deletedUser = await userModel.findByIdAndDelete(id)

      if(!deletedUser) {
        return res.status(404).json({
            message: "User not found"
        })
      }

      await res.clearCookie("token")

      return res.status(200).json({
        message: "Deleted!"
      })
    }catch(err) {
        console.error(err)
        throw new Error(err)
    }
}


export const getProfile = async (req, res) => {
    try{
     const user = req.user

     if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
     }

     return res.status(200).json({
        message: "Profile fetched successfully",
        data: user
     })
    }catch(err) {
        console.error(err)
        throw new Error(err)
    }
}