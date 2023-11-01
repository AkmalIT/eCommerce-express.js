const {Router} = require("express")
const router = new Router()
const db = require("../db-config/db")
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')



router.post('/add', authGuard, async (req, res) => {
    try {
        const {name} = req.body;

        if(!name){
            res.status(400).json({message: "enter the required information"})
            return
        }

        await db.query('INSERT INTO attribute (name) values ($1)', [name])
        return res.json(new ApiResponse("attribute created"))
    } catch (error) {
        console.log(error);
    }
})


router.get("/", authGuard, async(req, res) => {

    try {
      const { page, paginationLimit, catID } = req.query;
      if (catID) {
        const category = await db.query("SELECT * FROM category WHERE ID = $1", [catID]);
        if (category.rows.length === 0) {
          const error = new Error(`Category with ID: ${catID} not found`);
          error.status = 404;
          return error;
        }
        const getCountSqlQuery = `SELECT COUNT(*) AS total FROM attribute INNER
              JOIN category_attribute ON category_attribute.attribute_ID = attribute.ID
              WHERE category_attribute.category_ID = $1`;
        const  {rows: total} = await db.query(getCountSqlQuery, [catID]);
        const pagination = new Pagination(page, paginationLimit, total[0].total);
        const getDataSqlQuery = `SELECT * FROM attribute INNER
              JOIN category_attribute ON  category_attribute.attribute_ID = attribute.ID
              WHERE category_attribute.category_ID =$1
              LIMIT $2
              OFFSET $3`;
        const {rows: attributes} = await db.query(getDataSqlQuery, [catID, pagination.limit, pagination.offset]);
        return res.json(new ApiResponse(attributes, pagination));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
}) 
  

router.get('/search', authGuard, async (req, res) => {
    try {
    const {page, paginationLimit} = req.query
    const {offset, limit} = new Pagination(+page, paginationLimit)
    const category = await db.query(`SELECT * FROM attribute  LIMIT ${limit} OFFSET ${offset}`)
    return res.json(new ApiResponse(category.rows))
    } catch (error) {
        console.log(error);
    }
})


router.get('/:id', authGuard,async (req, res) => {
    const {id} = req.params
    const attribute = await db.query('SELECT * FROM attribute WHERE ID = $1', [id])
    if(attribute.rows.length === 0){
        res.status(404).json({message: "attribute not found"})
    }
    return res.json(new ApiResponse(attribute.rows[0]))
})


router.put('/update/:id', authGuard,async (req, res) => {
    try {
        const id  = req.params.id
        const {name} = req.body
        if(!name){
            res.status(400).json({message: "enter the required information"})
            return
        }
        const selectQuery = ('SELECT * FROM attribute WHERE id = $1')
        const {rows: attribute} = await db.query(selectQuery, [id]);
        if (attribute.length === 0) {
            res.json({ message: "category not found" })
            return
        }

        const updateName = name !== undefined ? name : attribute[0].name
        const result = await db.query('UPDATE attribute  set name = $1 WHERE ID = $2 RETURNING *', [updateName, id])
        return res.json(new ApiResponse(result.rows))
        
    } catch (error) {
        res.json({ message: error.message })
    }
})


router.delete('/delete/:id', authGuard, async(req, res) => {
    const {id} = req.params
    const attribute = await db.query('SELECT * FROM attribute WHERE ID = $1', [id])

    if(attribute.rowCount.length === 0){
        res.json({message: "attribute not found"})
        return
    }

     await db.query('DELETE FROM attribute WHERE ID = $1', [id])
    return res.json(new ApiResponse("attribute deleted")) 
})


module.exports = router