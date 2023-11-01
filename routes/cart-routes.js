const {Router} = require("express")
const router = new Router()
const db = require("../db-config/db")
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')


router.post('/add',  authGuard,  async (req, res) => {
    try {       
        const {productId , count} = req.body
        if(!productId || !count){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const product = await db.query('SELECT * FROM product WHERE ID = $1', [productId])
        if(product.rows.length === 0){
            res.json({message: "product not found"})
            return
        }
        await db.query('UPDATE product set cartcount = cartcount + 1 WHERE id = $1', [productId])
        await db.query('INSERT INTO basket (productID, userID, count) values ($1,$2,$3)', [productId, req.ID, count])
        return res.json(new ApiResponse("cart added"))
    } catch (err) {
        console.log(err);
    }
})


router.get('/', authGuard,async (req, res) => {
    try {      
        const {page, paginationLimit} = req.query
        const pagination = new Pagination(+page, paginationLimit)
        const condidate = await db.query('SELECT * FROM basket WHERE userID = $1', [req.ID])
        if(condidate.rows.length === 0){
            res.json({message: "user with this ID does not exist"})
            return
        }
        const userCart = await db.query(`SELECT * FROM basket WHERE userID = $1 LIMIT ${pagination.limit} OFFSET ${pagination.offset}`, [req.ID])
        return res.json(new ApiResponse(userCart.rows, pagination))
    } catch (err) {
        console.log(err);
    }
})

router.get('/:id', authGuard, async (req, res) => {
    try {
        const {id} = req.params
        const cart = await db.query('SELECT  * FROM basket WHERE id = $1', [id])
        if(cart.rows.length === 0){
            res.status(400).json("basket not found")
            return 
        }
        return res.json(new ApiResponse(cart.rows))
    } catch (error) {
        console.log(error);
    }
})

router.put('/update',authGuard, async (req, res) => {
    try {       
        const {Id, productId , count} = req.body
        if(!Id || !productId || !count){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const condidateProduct = await db.query('SELECT * FROM product WHERE ID = $1', [productId])
        if(condidateProduct.rows.length === 0){
            res.json({message: "product with this ID does not exist"})
            return
        }
        await db.query('UPDATE basket set productID = $1, count = $2 WHERE ID = $3', [productId, count, Id])
        return res.json(new ApiResponse("cart updated"))
    } catch (err) {
        console.log(err);
    }
})


router.delete('/delete', authGuard,async (req, res) => {
    try {      
        const {ID} = req.body
        const condidate = await db.query('SELECT * FROM userr WHERE ID = $1', [req.ID])
            if(condidate.rows.length === 0){
                res.json({message: "user with this ID does not exist"})
                return
        }
        await db.query('DELETE FROM basket WHERE ID = $1', [ID])
        return res.json(new ApiResponse("product removed from cart"))
    } catch (err) {
        console.log(err);
    }
})

module.exports = router