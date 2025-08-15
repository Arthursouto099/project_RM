import express, { urlencoded } from "express"
import dotenv from "dotenv"
import router from "./router/routes"
import cors from "cors"
import GlobalErrorHandler from "./Handlers/GlobalErrorHandler"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())



app.use("/v1", router)



app.use(urlencoded({extended: true}))
app.use(GlobalErrorHandler)

app.listen(process.env.PORT, () => console.log(`Running in port http://localhost:${process.env.PORT}`))