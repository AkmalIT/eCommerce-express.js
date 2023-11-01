require("dotenv").config()
const express = require("express")
const authRouter = require("./routes/auth-routes")
const categoryRouter = require("./routes/category-routes")
const userRoutes = require('./routes/user-routes')
const cartRouter = require('./routes/cart-routes')
const favouriteRouter = require('./routes/favourite-routes')
const addresRouter = require("./routes/address-routes")
const productRoutes = require("./routes/product-routes")
const commentRoutes = require("./routes/comment-routes")
const orderRoutes = require("./routes/order-routes")
const attributeRoutes = require("./routes/attribute-routes")
const attributeValuesRoutes = require("./routes/attribute-values")


const path = require("path")
const fileUpload = require("express-fileupload")


const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

app.use("/auth", authRouter)
app.use("/category", categoryRouter)
app.use("/users", userRoutes)
app.use("/cart", cartRouter)
app.use("/favourite", favouriteRouter)
app.use("/addres", addresRouter)
app.use("/product", productRoutes)
app.use("/comment", commentRoutes)
app.use("/order", orderRoutes)
app.use("/attribute", attributeRoutes)
app.use("/attributeValue", attributeValuesRoutes)


app.listen(PORT, () => console.log("Server started on PORT " + PORT))