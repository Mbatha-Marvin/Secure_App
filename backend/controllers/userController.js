const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


// @desc create user
// @route POST /api/users
//@access Public
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password){
        res.status(400)
        throw new Error('Enter all the fields')
    }

    // check if the user exists
    const userExists = await User.findOne({email})

    if (userExists){
        res.status(400)
        throw new Error('User already Exists')
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create User 
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if (user){
        res.status(201).json( {
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid User Credentials')
    }
})

// @desc user login
// @route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if (!email){
        res.status(400)
        throw new Error('No Email was provided')
    }
    if (!password){
        res.status(400)
        throw new Error('Password is required')
    }

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid User credentials')
    }
})

// Generate Tokens(JWT)

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '10m',
    })
}

// @desc Get user credentials
// @route GET /api/users/me
//@access Private
const getMe = asyncHandler(async (req, res) => {
    // req.user was set in the protect middleware
    const {_id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
})


module.exports ={
    registerUser,
    loginUser,
    getMe,
}