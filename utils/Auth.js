const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/index')
const passport = require('passport')


const userResgister = async (details, role, res) => {
    try {
        let usernameNotTaken = await validateUsername(details.username)
        if (!usernameNotTaken) {
            return res.status(400).json({
                message: "Username is already Taken",
                success: false
            })
        }

        let emailNotRegistered = await validateEmail(details.email)
        if (!emailNotRegistered) {
            return res.status(400).json({
                message: "Email is already Taken",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(details.password, 12)

        const newUser = new User({
            ...details,
            password: hashedPassword,
            role: role
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            if (role === "admin") {
                return res.status(200).json({
                    message: "Admin is Created Successfully",
                    success: true
                })

            } else if (role === "SubscribedUser") {
                return res.status(200).json({
                    message: "SubscribedUser is Created Successfully",
                    success: true
                })
            } else if (role === "user") {

                return res.status(200).json({
                    message: "User is Created Successfully",
                    success: true
                })
            }

        }

    } catch (err) {
        //loger function
        // WINSTON Library
        return res.status(500).json({
            message: `Unable to create an account ${err}...`,
            success: true
        })
    }
}

const userLogin = async (userCreds, role, res) => {
    let { username, password } = userCreds;

    const user = await User.findOne({ username })
    if (!user) {
        return res.status(404).json({
            message: "User not found, Invalid Credentials.",
            success: true
        })
    }

    if (user.role !== role) {
        return res.status(403).json({
            message: "Please make sure you are logging in from the Right Portal...",
            success: false
        })
    }

    let isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(403).json({
            message: "Icorrect Password",
            success: false
        })
    } else {
        let token = jwt.sign(
            {
                user_id: user._id,
                role: user.role,
                username: user.username,
                email: user.email
            },
            SECRET, { expiresIn: "7 days" }
        )

        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        }

        return res.status(200).json({
            ...result,
            message: "Congrats!!! You are successfully Loged in.",
            success: true
        })
    }

}

const validateUsername = async (username) => {
    let user = await User.findOne({ username })
    if (user) {
        return false;
    } else {
        return true
    }
}

const validateEmail = async (email) => {
    let user = await User.findOne({ email })
    if (user) {
        return false;
    } else {
        return true
    }
}

//Passport Middleware
const userAuth = passport.authenticate('jwt', { session: false })

//Role Check Middleware
const checkRole = roles => (req, res, next) => {
    console.log("Check ----> ", roles)
    if (roles.includes(req.user.role)) {
        return next();
    }
    else {
        return res.status(401).json("Unauthorized")
    }
}

//for elimnation of password on <req.user>
const serializeUser = user => {
    return {
        _id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

module.exports = {
    userResgister,
    userLogin,
    userAuth,
    serializeUser,
    checkRole
}