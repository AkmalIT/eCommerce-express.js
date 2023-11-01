const {Router} = require("express")
const router = new Router()
const db = require('../db-config/db')
const Pagination = require("../utils/pagination")
const ApiResponse = require("../utils/apiResponse")
const authGuard = require("../middlewares/auth-middleware")
const uuid = require('uuid')
const path = require('path')


router.post("/create", authGuard,async (req, res)  => {
    try {
        const {nameuz, nameru, vievcount, desuz, desru}  = req.body;
        const {image} = req.files;

        
        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, "..", "static", fileName))

        if(!nameuz || !nameru || !vievcount || !image || !desuz || !desru){
            res.status(400).json({message: "enter the required information"})
            return
        }
        await db.query('INSERT INTO category (nameuz, nameru, vievcount, image, desuz, desru) values ($1,$2,$3,$4,$5,$6)', [nameuz, nameru,vievcount, fileName, desuz, desru])
        return res.json(new ApiResponse("category created ✔"))
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})




router.get('/', authGuard,async (req, res) => {
    try {      
        const {page, paginationLimit} = req.query
    const {offset, limit} = new Pagination(+page, paginationLimit)
    const product = await db.query(`SELECT * FROM category LIMIT ${limit} OFFSET ${offset}`)
    return res.json(new ApiResponse(product.rows))
    } catch (error) {
        console.log(error);
    }
})

router.get('/:id', authGuard,async (req, res) => {
    const {id} = req.params
    const category = await db.query('SELECT * FROM category WHERE ID = $1', [id])
    if(category.rows.length === 0){
        res.json({message: "category not found"})
        return
    }
    return res.json(new ApiResponse(category.rows[0]))
})

router.put('/:id', authGuard,async (req, res) => {
    try {
        const id  = req.params.id
        const {nameuz, nameru, vievcount, image, desuz, desru} = req.body
        if(!nameuz || !nameru || !viewcount || !image || !desuz || !desru){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const selectQuery = ('SELECT * FROM category WHERE id = $1')
        const {rows: category} = await db.query(selectQuery, [id]);
        if (category.length === 0) {
            res.json({ message: "category not found" })
            return
        }

        const updateNameUZ = nameuz !== undefined ? nameuz : category[0].nameuz
        const updateNameRU = nameru !== undefined ? nameru : category[0].nameru  
        const updateViewCount = vievcount !== undefined ? vievcount : category[0].vievcount;
        const updatedImage = image !== undefined ? image : category[0].image;
        const updatedDesUz = desuz !== undefined ? desuz : category[0].desuz;
        const updatedDesRu = desru !== undefined ? desru : category[0].desru;



        const result = await db.query('UPDATE category  set nameuz = $1, nameru = $2, vievcount = $3, image = $4, desuz = $5, desru = $6 WHERE ID = $7 RETURNING *', [updateNameUZ, updateNameRU, updateViewCount, updatedImage, updatedDesUz, updatedDesRu, id])
        return res.json(new ApiResponse(result.rows))       
    } catch (error) {
        res.json({ message: error.message })
    }
})


router.delete('/:id', authGuard,async (req, res) => {
    const {id} = req.params
    const product = await db.query('SELECT * FROM category WHERE ID = $1', [id])

    if(product.rowCount.length === 0){
        res.json({message: "product not found"})
        return
    }

     await db.query('DELETE FROM category WHERE ID = $1', [id])
    return res.json(new ApiResponse("product deleted")) 
})

module.exports = router