const {Router} = require("express")
const router = new Router()
const db = require('../db-config/db')
const authGuard = require('../middlewares/auth-middleware')
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')

router.post('/add', authGuard, async (req, res) => {
    try {       
        const {productId} = req.body
        if(!productId){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const product = await db.query('SELECT * FROM product WHERE ID = $1', [productId])
        if(product.rows.length === 0){
            res.json({message: "product not found"})
            return
        }
        await db.query('UPDATE product set favoritecount = favoritecount + 1 WHERE id = $1', [productId])
        await db.query('INSERT INTO favorite (productID, userID) values ($1,$2)', [productId, req.ID])
        return res.json(new ApiResponse("added"))
    } catch (err) {
        console.log(err);
    }
})


router.get('/', authGuard , async (req, res) => {
    try {      
        const {page, paginationLimit} = req.query
        const pagination = new Pagination(+page, paginationLimit)
        const condidate = await db.query('SELECT * FROM favorite WHERE userID = $1', [req.ID])
        if(condidate.rows.length === 0){
            res.json({message: "user with this ID does not exist"})
            return
        }
        const userCart = await db.query(`SELECT * FROM favorite WHERE userID = $1 LIMIT ${pagination.limit} OFFSET ${pagination.offset}`, [req.ID])
        return res.json(new ApiResponse(userCart.rows, pagination))
    } catch (err) {
        console.log(err);
    }
})

router.put('/update', authGuard, async (req, res) => {
    try {       
        const {Id, productId} = req.body
        if(!Id || !productId){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const condidateProduct = await db.query('SELECT * FROM product WHERE ID = $1', [productId])
        if(condidateProduct.rows.length === 0){
            res.json({message: "product with this ID does not exist"})
            return
        }
        await db.query('UPDATE favorite set productID = $1 WHERE ID = $2', [productId, Id])
        return res.json(new ApiResponse("favourite updated"))
    } catch (err) {
        console.log(err);
    }
})


router.delete('/delete', authGuard , async (req, res) => {
    try {      
        const {ID} = req.body
        const condidate = await db.query('SELECT * FROM userr WHERE ID = $1', [req.ID])
            if(condidate.rows.length === 0){
                res.json({message: "user with this ID does not exist"})
                return
        }
        await db.query('DELETE FROM favorite WHERE ID = $1', [ID])
        return res.json( new ApiResponse("favourite removed from cart"))
    } catch (err) {
        console.log(err);
    }
})

module.exports = router