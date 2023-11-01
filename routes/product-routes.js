const {Router} = require('express')
const router = new Router();
const db = require('../db-config/db')
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')
const uuid = require('uuid')
const path = require('path')

router.post('/add', authGuard , async (req, res) => {
    try {
        const {nameuz, nameru, categoryid, desshortuz, desshortru, desuz, desru, ispopular, vievcount, price, cartcount, favoritecount, ordercount, discount} = req.body
        const {image} = req.files
        
        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, "..", "static", fileName))

        const category = await db.query('SELECT * FROM category WHERE id = $1', [categoryid])

        if(category.rows.length === 0){
            res.status(404).json({message: "category not found"})
            return 
        }

        if(!nameuz || !nameru || !categoryid || !desshortuz || !desshortru || !desuz || !desru || !ispopular || !vievcount || !price || !cartcount || !favoritecount || !ordercount || !discount || !image){
            res.status(400).json({message: "enter the required information"})
            return
        }T

        const product = await db.query('INSER INTO product(nameuz, nameru, categoryid, descshortuz, descshortru, descuz, descru, ispopular, vievcount, price, cartcount, favoritecount, ordercount, discount, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *', [nameuz, nameru, categoryid, desshortuz, desshortru, desuz, desru, ispopular, vievcount, price, cartcount, favoritecount, ordercount, discount, fileName])
        await db.query('INSERT INTO category_product (category_id, product_id) values ($1, $2)', [categoryid, product.rows[0].id])
        return res.json(new ApiResponse("product added"))

    } catch (error) {
        console.log(error);
    }
})



router.get("/", authGuard, async(req, res) => {

    try {
      const { page, paginationLimit, attvalueId, catid } = req.query;
      if (attvalueId && catid) {
        const category = await db.query("SELECT * FROM category WHERE ID = $1", [catid]);
        if (category.rows.length === 0) {
          const error = new Error(`Category value  with ID: ${catid} not found`);
          error.status = 404;
          return error;
        }

        const attributevalue = await db.query("SELECT * FROM attributevalue WHERE ID = $1", [attvalueId]);
        if (attributevalue.rows.length === 0) {
          const error = new Error(`Attribute value  with ID: ${attvalueId} not found`);
          error.status = 404;
          return error;
        }

        const getCountSqlQuery = `SELECT COUNT(*) AS total FROM product_attributevalue INNER
              JOIN product ON product.ID = product_attributevalue.product_id
              WHERE product_attributevalue.attributevalue_id = $1 AND product.categoryid = $2`;
        const  total = await db.query(getCountSqlQuery, [attvalueId, catid]);
        const pagination = new Pagination(page, paginationLimit, total.rows[0].total);
        const getDataSqlQuery = `SELECT * FROM product_attributevalue INNER
              JOIN product ON  product.ID = product_attributevalue.product_id
              WHERE  product_attributevalue.attributevalue_id = $1 AND  product.categoryid = $2
              LIMIT $3
              OFFSET $4`;
        const {rows: attributes} = await db.query(getDataSqlQuery, [attvalueId, catid,pagination.limit, pagination.offset]);
        res.json(new ApiResponse(attributes, pagination));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
}) 


router.get('/search', authGuard, async (req, res) => {
    try {
    const {page, paginationLimit, catId} = req.query
    const {offset, limit} = new Pagination(+page, paginationLimit)
    const category = await db.query(`SELECT * FROM product WHERE categoryid = $1 LIMIT ${limit} OFFSET ${offset}`, [catId])
    return res.json(new ApiResponse(category.rows))
    } catch (error) {
        console.log(error);
    }
})
  

router.get('/:id', authGuard, async (req, res) => {
    const {id} = req.params;
     
    const {rows: product} = await db.query('SELECT * FROM product WHERE id = $1', [id,])

    if (product.length === 0) {
        res.status(404).json({message: `Product with id:${id} not exists`})
        return 
    }
    await db.query( "UPDATE product SET vievcount = vievcount + 1 WHERE id = $1", [id])
    
    return res.json(new ApiResponse(product[0]))
})


router.put('/update/:id', authGuard , async (req, res) => {
    try{
        const {id} = req.params
        const {nameuz , nameru, desshortuz, desshortru, categoryid, desuz, desru, price, discount} = req.body;
        const {image} = req.files;

        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, "..", "static", fileName))


        if(!nameuz || !nameru || !categoryid || !desshortuz || !desshortru || !desuz || !desru || !price || !discount || !image){
            res.status(400).json({message: "enter the required information"})
            return
        }

        const {rows: product} = await db.query('SELECT * FROM product WHERE id = $1', [id]);
        if (product.length === 0) {
            res.json({ message: "product not found" })
            return
        }

        const updateNameUZ = nameuz !== undefined ? nameuz : product[0].nameuz;
        const updateNameRU = nameru !== undefined ? nameru : product[0].nameru;
        const updateCategoryId = categoryid !== undefined ? categoryid : product[0].categoryid;
        const updatedDesUz = desuz !== undefined ? desuz : product[0].desuz;
        const updatedDesRu = desru !== undefined ? desru : product[0].desru;
        const updatedShortDesRu = desshortru !== undefined ? desshortru : product[0].desshortru;
        const updatedShortDesUz = desshortuz !== undefined ? desshortuz : product[0].desshortuz;
        const updatedPrice = price !== undefined ? price : product[0].price;
        const updatedDiscount = discount !== undefined ? discount : product[0].discount;

        await db.query('UPDATE product set nameuz = $1, nameru = $2, categoryid = $3, images = $4, descshortuz = $5, descshortru = $6, descuz = $7, descru = $8, price = $9, discount = $10 WHERE id = $11', [updateNameUZ, updateNameRU, updateCategoryId, fileName, updatedShortDesUz, updatedShortDesRu, updatedDesUz, updatedDesRu, updatedPrice, updatedDiscount, id])
        return res.status(200).json(new ApiResponse("product updated"))
    }catch(error){
        console.log(error);
    }
})




router.delete('/delete/:id', authGuard , async (req, res) => {
    const {id} = req.params
    const product = await db.query('SELECT * FROM product WHERE ID = $1', [id])

    if(product.rowCount.length === 0){
        res.json({message: "product not found"})
        return
    }

     await db.query('DELETE FROM product WHERE ID = $1', [id])
    return res.json(new ApiResponse("product deleted")) 
})


module.exports = router