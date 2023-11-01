const {Router} = require("express")
const router = new Router()
const db = require("../db-config/db")
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')




router.post('/add', authGuard, async (req, res) => {
    try {
        const {name, attribute_id} = req.body;

        const attribute = await db.query('SELECT * FROM attribute WHERE id = $1', [attribute_id])

        if(attribute.rows.length === 0){
            res.status(404).json({message: "attribute not found"})
            return
        }

        if(!name || !attribute_id){
            res.status(400).json({message: "enter the required information"})
            return
        }

        await db.query('INSERT INTO attributevalue (name, attributeid) values ($1,$2)', [name, attribute_id])
        return res.json(new ApiResponse("attribute value created"))
    } catch (error) {
        console.log(error);
    }
})


router.get("/", authGuard, async(req, res) => {

    try {
      const { page, paginationLimit, attId } = req.query;
      if (attId) {
        const category = await db.query("SELECT * FROM attribute WHERE ID = $1", [attId]);
        if (category.rows.length === 0) {
          const error = new Error(`Attribute with ID: ${attId} not found`);
          error.status = 404;
          return error;
        }
        const getCountSqlQuery = `SELECT COUNT(*) AS total FROM attribute INNER
              JOIN attributevalue ON attributevalue.attributeid = attribute.ID
              WHERE attributevalue.attributeid = $1`;
        const  total = await db.query(getCountSqlQuery, [attId]);
        const pagination = new Pagination(page, paginationLimit, total.rows[0].total);
        const getDataSqlQuery = `SELECT * FROM attribute INNER
              JOIN attributevalue ON  attributevalue.attributeid = attribute.ID
              WHERE attributevalue.attributeid = $1
              LIMIT $2
              OFFSET $3`;
        const {rows: attributes} = await db.query(getDataSqlQuery, [attId, pagination.limit, pagination.offset]);
        res.json(new ApiResponse(attributes, pagination));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
}) 
  
router.get('/search', authGuard, async (req, res) => {
    try {
    const {page, paginationLimit, attId} = req.query
    const {offset, limit} = new Pagination(+page, paginationLimit)
    const category = await db.query(`SELECT * FROM attributevalue WHERE attributeid = $1 LIMIT ${limit} OFFSET ${offset}`, [attId])
    return res.json(new ApiResponse(category.rows))
    } catch (error) {
        console.log(error);
    }
})



router.get('/:id', authGuard,async (req, res) => {
    const {id} = req.params
    const attributevalue = await db.query('SELECT * FROM attributevalue WHERE ID = $1', [id])
    if(attributevalue.rows.length === 0){
        res.status(404).json({message: "attributevalue not found"})
    }
    return res.json(new ApiResponse(attributevalue.rows[0]))
})


router.put('/update/:id', authGuard,async (req, res) => {
    try {
        const id  = req.params.id
        const {name} = req.body
        if(!name){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const selectQuery = ('SELECT * FROM attributevalue WHERE id = $1')
        const {rows: attribute} = await db.query(selectQuery, [id]);
        if (attribute.length === 0) {
            res.json({ message: "attribute not found" })
            return
        }

        const updateName = name !== undefined ? name : attribute[0].name
        const result = await db.query('UPDATE attributevalue  set name = $1 WHERE ID = $2 RETURNING *', [updateName, id])
        return res.json(new ApiResponse(result.rows))
    } catch (error) {
        res.json({ message: error.message })
    }
})


router.delete('/delete/:id', authGuard, async(req, res) => {
    const {id} = req.params
    const attribute = await db.query('SELECT * FROM attributevalue WHERE ID = $1', [id])

    if(attribute.rowCount.length === 0){
        res.json({message: "attribute not found"})
        return
    }

     await db.query('DELETE FROM attributevalue WHERE ID = $1', [id])
    return res.json(new ApiResponse("attribute deleted")) 
})


module.exports = router