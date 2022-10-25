const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try {
            // get the token from the request headers
            token = req.headers.authorization.split(' ')[1]

            // verify the token 
            let decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get user using the id in the token and pass it to the request body
            // select to exclude the password in the query response
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            if(error.expiredAt){
                res.status(401)
                throw new Error('Not authorized token expired')
            }
            console.log(error)
            res.status(401)
            throw new Error('Not authorized, Invalid Token')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not Authorized, No Token')
    }
})

module.exports = {protect}