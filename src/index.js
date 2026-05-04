
import express from "express"
import userRoutes from "./routes/user.routes.js"
const app = express()

app.use("/api", userRoutes)

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
})

