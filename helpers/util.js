const jwt = require('jsonwebtoken');
const User = require('../models/user')

class Response {
    constructor(data, success = true) {
        this.data = data
        this.success = success
    }
}

const tokenKey = 'RUBICAMP'

const generateToken = (data) => jwt.sign(data, tokenKey);

const decodeToken = (token) => jwt.verify(token, tokenKey);

const isLoggedIn = async (req, res, next) => {
    try {
        const bearerToken = req.get('Authorization')
        const token = bearerToken?.split(' ')[1]
        if (!token) return res.status(401).json(new Response('token not provided', false))
        const data = decodeToken(token)
        if (!data.userid) return res.status(401).json(new Response('user is not authorized', false))
        const user = await User.findById(data.userid)
        if (user.token !== token) return res.status(401).json(new Response('user is not authorized', false))
        req.user = user
        next()
    } catch (err) {
        console.log(err);
        res.status(401).json(new Response('user is not authorized', false))
    }
}

const signout = async (req, res, next) => {
    try {
        const bearerToken = req.get('Authorization')
        const token = bearerToken?.split(' ')[1]
        if (!token) return res.status(401).json(new Response('token not provided', false))
        const data = decodeToken(token)
        if (!data.userid) return res.status(401).json(new Response('user is not authorized', false))
        const user = await User.findById(data.userid)
        user.token = null
        await user.save()
        res.status(200).json(new Response('you was succesfull logged'))
    } catch (err) {
        console.log(err);
        res.status(401).json(new Response('user is not authorized', false))
    }
}

module.exports = {
    Response,
    generateToken,
    decodeToken,
    isLoggedIn,
    signout
}