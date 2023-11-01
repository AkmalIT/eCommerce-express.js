const jwt = require('jsonwebtoken')
require("dotenv").config()

 function authGuard(req, res, next){
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
        return res.status(401).json({message: "Не авторизован"})
        }
        
        const {ID} = jwt.verify(token, process.env.ACCES_TOKEN)
        req.ID = ID
        next()
    } catch (error) {
        res.status(401).json(error)
    }
}

module.exports = authGuard