
import { userModel } from "../models/userModel.js"
import { validateSignup } from "../validator/userValidator.js"


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
     
        return res.status(201).json({
         message: "User created successfully!",
         data: newUser
        })
    } catch (error) {
        
    }
}