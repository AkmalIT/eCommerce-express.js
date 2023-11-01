const {Router} = require("express")
const router = new Router()
const db = require("../db-config/db")
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')



router.post('/add', authGuard , async (req, res) => {
    try {
        const {productId, addresId, deliverytime, orderstatus , deliveryprice, ordercount} = req.body

        const product = await db.query('SELECT * FROM product WHERE id = $1', [productId])
        const address = await db.query('SELECT * FROM address WHERE id = $1', [addresId])

        if(product.rows.length === 0){
            res.status(404).json({message: "product not found"})
            return
        }

        if(address.rows.length === 0){
            res.status(404).json({message: "addres not found"})
            return
        }

        if(req.ID !== address.rows[0].userid){
            res.status(400).json({message: "this comment does not belong to you"})
            return
        }

        if(!productId || !addresId || !deliverytime || !orderstatus || !deliveryprice || !ordercount){
            res.status(400).json({message: "enter the required information"})
            return
        }

        await db.query('INSERT INTO orderr(userid, productid, addressid, deliverytime, orderstatus, deliveryprice, ordercount) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.ID, productId, addresId, deliverytime, orderstatus, deliveryprice, ordercount])
        return res.json(new ApiResponse("order added"))


    } catch (error) {
        console.log(error);
    }
})

router.get('/', authGuard, async (req, res) => {
    try {
        const {page, paginationLimit} = req.query;
        const pagination = new Pagination(+page, paginationLimit)
        const product = await db.query(`SELECT * FROM orderr WHERE userid = $1 LIMIT ${pagination.limit} OFFSET ${pagination.offset}`, [req.ID])
        return res.json(new ApiResponse(product.rows, pagination))
    } catch (error) {
        console.log(error);
    }
})


router.get('/:id', authGuard , async (req, res) => {
    try {
        const {id} = req.params;
     
        const {rows: product} = await db.query('SELECT * FROM orderr WHERE id = $1', [id,])
    
        if (product.length === 0) {
            res.status(404).json({message: `Product with id:${id} not exists`})
            return 
        }
        return res.json(new ApiResponse(product[0]))
    } catch (error) {
        console.log(error);
    }
})


router.put('/update/:id', authGuard, async (req, res) => {
    try {
        const {id} = req.params
        const {addresId , deliverytime, orderstatus, deliveryprice, ordercount} = req.body;
       
        const address = await db.query('SELECT * FROM address WHERE id = $1', [addresId])

        if(address.rows.length === 0){
            res.status(404).json({message: "addres not found"})
            return
        }

        if(req.ID !== address.rows[0].userid){
            res.status(400).json({message: "this order does not belong to you"})
            return
        }


        if(!addresId || !deliverytime || !orderstatus || !deliveryprice || !ordercount){
            res.status(400).json({message: "enter the required information"})
            return
        }

        const {rows: product} = await db.query('SELECT * FROM orderr WHERE id = $1', [id]);
        if (product.length === 0) {
            res.json({ message: "order not found" })
            return
        }

        const updateAddressId = addresId !== undefined ? addresId : product[0].addressid;
        const updateDeliveryTime = deliverytime !== undefined ? deliverytime : product[0].deliverytime;
        const updateOrderStatus = orderstatus !== undefined ? orderstatus : product[0].orderstatus;
        const updatedDeliveryPrice = deliveryprice !== undefined ? deliveryprice : product[0].deliveryprice;
        const updatedOrderCount = ordercount !== undefined ? ordercount : product[0].ordercount;

        await db.query('UPDATE orderr set addressid = $1, deliverytime = $2, orderstatus = $3,  deliveryprice = $4, ordercount = $5 WHERE id = $6', [updateAddressId, updateDeliveryTime, updateOrderStatus, updatedDeliveryPrice, updatedOrderCount, id])
        return res.status(200).json(new ApiResponse("order updated"))
    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete/:id', authGuard, async (req, res) => {
    try {
        const {id} = req.params
        const order = await db.query('SELECT * FROM orderr WHERE ID = $1', [id])
        
        if(req.ID !== order.rows[0].userid){
            res.status(400).json({message: "this order does not belong to you"})
            return
        }


        if(order.rowCount.length === 0){
            res.json({message: "orderr not found"})
            return
        }
    
         await db.query('DELETE FROM orderr WHERE ID = $1', [id])
        return res.json(new ApiResponse("product deleted")) 
    } catch (error) {
        console.log(error);
    }
})


module.exports = router