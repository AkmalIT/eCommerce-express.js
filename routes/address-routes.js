const {Router} = require('express')
const router = new Router();
const db = require('../db-config/db')
const authGuard = require("../middlewares/auth-middleware")
const Pagination = require("../utils/pagination")
const ApiResponse = require('../utils/apiResponse')

router.post('/add', authGuard,async (req, res) => {
    try {   
        const {region, referencepoint , street, house, room} = req.body
        const user = await db.query('SELECT * FROM address WHERE userid = $1', [req.ID])
        if(user.rows.length !== 0){
            res.status(400).json({message: "your address already exists"})
            return 
        }
        if(!region || !referencepoint || !street || !house || !room){
            res.status(401).json({message: "enter the required information"})
            return 
        }
        const condidate = await db.query('SELECT * FROM userr WHERE ID = $1', [req.ID])
        if(condidate.rows.length === 0){
            res.send("user not exists")
            return
        }
        await db.query('INSERT INTO address (userid, region, referencepoint, street, house, room) values ($1, $2, $3, $4, $5, $6)', [req.ID, region, referencepoint, street, house, room])
        return res.send(new ApiResponse("addres added"))
    } catch (error) {
        console.log(error);
    }

})



router.get('/', authGuard, async (req, res) => {
    try {
        const {page, paginationLimit} = req.query
        const pagination = new Pagination(+page, paginationLimit)
        const attribute = await db.query(`SELECT * FROM address LIMIT ${pagination.limit} OFFSET ${pagination.offset}`)
        return res.json(new ApiResponse(attribute.rows, pagination))
    } catch (error) {
        console.log(error);
    }
})



router.get("/:id", authGuard,async (req, res) => {
    try {
        const {id} = req.params;
        const {rows: address} = await db.query('SELECT * FROM address WHERE id = $1', [id]);
        if (address.length === 0) {
            const apiResponse = new ApiResponse(null, null, 'Address not found');
            res.status(404).json(apiResponse);
            return;
        }
        const apiResponse = new ApiResponse(address);
        return res.json(apiResponse);
    }catch (error) {
        console.log(error);
    }

}) 
   
router.put('/update/:id', authGuard, async (req, res) => {

    try {
            const {id} = req.params;
            const { region, referencePoint, street, house, room } = req.body;
            const address = await db.query('SELECT * FROM address WHERE id = $1', [id])
            if(address.rows.length === 0){
                res.status(404).json({message: "address not found"})
                return 
            }

            const updatedRegion = region !== undefined ? region : address.rows[0].region;
            const updatedReferencepoint = referencePoint !== undefined ? referencePoint : address.rows[0].referencePoint;
            const updatedStreet = street !== undefined ? street : address.rows[0].street;
            const updatedHouse = house !== undefined ? house : address.rows[0].house;
            const updatedRoom = room !== undefined ? room : address.rows[0].room;
    
            const updateQuery = 'UPDATE address SET region = $1, referencePoint = $2, street = $3, house = $4, room = $5 WHERE id = $6';
            await db.query(updateQuery, [updatedRegion, updatedReferencepoint, updatedStreet, updatedHouse, updatedRoom, id]);
    
            const apiResponse = new ApiResponse('Address updated successfully');
            return res.json(apiResponse);
        } catch (error) {
            console.log(error);
        }

})    

router.delete("/delete/:id", authGuard, async (req, res) => {
    try {
        const {id} = req.params;
        const getID = 'SELECT * FROM address WHERE ID = $1';
        const {rows: row} = await db.query(getID, [id])

        if (row.length === 0) {
            res.send({ message: "address not found" })
            return
        }
        
        const query = 'DELETE FROM address WHERE ID = $1';
        await db.query(query, [id]);
        return res.json(new ApiResponse("address deleted"));
    } catch (error) {
        console.log(error);
    }
}) 


module.exports = router