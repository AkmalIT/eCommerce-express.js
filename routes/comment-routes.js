const {Router} = require("express")
const router = new Router()
const db = require("../db-config/db")
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')

router.post('/add', authGuard , async (req, res) => {
    try {
        const {productId, stars, comment} = req.body;
        const user = await db.query('SELECT * FROM review WHERE userid = $1', [req.ID])
        if(user.rows.length !== 0){
            res.status(400).json({message: "your comment already exists"})
            return 
        }

        if(!productId || !stars || !comment){
            res.status(400).json({message: "enter the required information"})
            return
        }
        
        const product = await db.query('SELECT * FROM product WHERE ID = $1', [productId])
        if(product.rows.length === 0){
            res.json({message: "product not found"})
            return
        }

        await db.query('INSERT INTO review (userid, productid, stars, comment) values ($1, $2, $3, $4)', [req.ID, productId, stars, comment])
        return res.json(new ApiResponse("comment added"))
    } catch (error) {
        console.log(error);
    }
})


router.get('/', authGuard , async (req, res) => {
    try {
        const {productId, page, paginationLimit} = req.query;
        const {rows} = await db.query(`SELECT COUNT('ID') AS totalItems FROM review`)
        const totalItems = rows[0].totalitems
        const pagination = new Pagination(+page, paginationLimit,totalItems)
        const {rows:result} = await db.query(`SELECT * FROM review WHERE productid = $1 LIMIT ${pagination.limit} OFFSET ${pagination.offset}`, [productId])
        if (result.length == 0) {
            return new Error("category not found")
        }
        return res.send(new ApiResponse(result, totalItems, pagination))
    } catch (error) {
        console.log(error);
    }
})


router.get('/:id', authGuard, async (req, res) => {
    try {
        const {id} = req.params;
        const {rows: comment} = await db.query('SELECT * FROM review WHERE id = $1', [id]);
        if (!comment) {
            const apiResponse = new ApiResponse(null, null, 'comment not found');
            res.status(404).json(apiResponse);
            return;
        }
        const apiResponse = new ApiResponse(comment);
        return res.json(apiResponse);
    }catch (error) {
        console.log(error);
    }
})


router.put('/update/:id', authGuard , async (req, res) => {
    try {
        const {id} = req.params;
        const { stars, comment } = req.body;
        const userComment = await db.query('SELECT * FROM review WHERE id = $1', [id])

        if(req.ID !== userComment.rows[0].userid){
            res.status(400).json({message: "this comment does not belong to you"})
            return
        }

        if(userComment.rows.length === 0){
            res.status(404).json({message: "userComment not found"})
        }

        const updatedRegion = stars !== undefined ? stars : userComment.rows[0].stars;
        const updatedReferencepoint = comment !== undefined ? comment : userComment.rows[0].comment;

        const updateQuery = 'UPDATE review SET stars = $1, comment = $2  WHERE id = $3';
        await db.query(updateQuery, [updatedRegion, updatedReferencepoint, id]);

        const apiResponse = new ApiResponse('Comment updated successfully');
        return res.json(apiResponse);
    } catch (error) {
        console.log(error);
    }
})



router.delete('/delete/:id', authGuard , async (req, res) => {
    try {
        const {id} = req.params;
        const getID = 'SELECT * FROM review WHERE ID = $1';
        const {rows: row} = await db.query(getID, [id])


        if(req.ID !== row[0].userid){
            res.status(400).json({message: "this comment does not belong to you"})
            return
        }

        if (row.length === 0) {
            res.send({ message: "comment not found" })
            return
        }
        
        const query = 'DELETE FROM review WHERE ID = $1';
        await db.query(query, [id]);
        return res.json(new ApiResponse("deleted"));
    } catch (error) {
        console.log(error);
    }
})


module.exports = router