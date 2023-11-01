require("dotenv").config()
const {Router} = require('express')
const router = new Router()
const db = require("../db-config/db")
const  jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const authGuard = require("../middlewares/auth-middleware")
const uuid = require('uuid')
const path = require('path')



router.post('/registration', async (req, res) => {
    try {    
        const {name, password, phone} = req.body 
        const {image} = req.files;

        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, "..", "static", fileName))

        if(!name || !password || !phone || !image){
            res.status(400).json({message: "enter the required information"})
            return 
        }
        const condidate = await db.query('SELECT * FROM userr WHERE phone = $1', [phone])
        if(condidate.rows.length > 0){
             res.json({message: `user with this phone number ${phone},  exists`})
             return 
        }
        const hashedPassword =  await bcrypt.hash(password, 10)
         await db.query('INSERT INTO userr (name, hashedPassword, phone, image) values ($1,$2,$3,$4) RETURNING *', [name, hashedPassword, phone, fileName])
        return res.json({message: "✔"})
    } catch (error) {
        console.log(error);
    }

})
router.post('/login',async (req, res) => {
    try {       
        const {password , phone} = req.body
        if(!password || !phone) {
            res.status(400).json({message: "enter the required information"})
            return
        }
        const condidate = await db.query('SELECT * FROM userr WHERE phone = $1', [phone])
        if(condidate.rows.length == 0 ){
             res.json({message: "user not found"})
             return
        }
        const comparePassword = await bcrypt.compare(password, condidate.rows[0].hashedpassword)
        if(!comparePassword){
           res.json({message: "user invalid"})
           return
        }
    
        const accesToken = jwt.sign({ID: condidate.rows[0].id, user: condidate.rows[0].name}, process.env.ACCES_TOKEN, {expiresIn: "30m"})
        const refreshToken = jwt.sign({ID: condidate.rows[0].id, user: condidate.rows[0].name}, process.env.REFRESH_TOKEN, {expiresIn: "30d"})
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
         await db.query('UPDATE userr set hashedrefreshtoken = $1 WHERE ID = $2', [hashedRefreshToken, condidate.rows[0].id])
        return res.json({accesToken: accesToken, refreshToken: refreshToken})
    } catch (error) {
        console.log(error);
    }

})
router.post('/logout', authGuard,async (req, res) => {
    try {      
        await db.query('UPDATE userr set hashedrefreshtoken = null WHERE ID = $1', [req.ID])
        return res.json({message:"deleted"})
    } catch (error) {
        console.log(error);
    }
})
router.post('/refresh', async (req, res) => {
    try {
        const refreshTokenFromClient = req.body.refreshToken
        const { ID } = jwt.verify(refreshTokenFromClient, process.env.REFRESH_TOKEN);
        const {rows: condidate} = await db.query('SELECT * FROM userr WHERE ID = $1',  [ID])
        if(condidate[0].hashedrefreshtoken == null){
            res.json(" а хуй тебе ")
            return
        }
        const accessToken = jwt.sign({ ID }, process.env.ACCES_TOKEN, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ ID}, process.env.REFRESH_TOKEN, { expiresIn: '7d' });
        return res.json({ accessToken, refreshToken });

    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router


