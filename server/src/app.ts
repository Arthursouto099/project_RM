import express, { urlencoded } from "express"
import dotenv from "dotenv"
import router from "./router/routes"
import cors from "cors"

dotenv.config()

const app = express()


app.use(cors())
app.use(router)
app.use(express.json())
app.use(urlencoded({extended: true}))



app.listen(process.env.PORT, () => console.log(`Running in port http://localhost:${process.env.PORT}`))