import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
   origin: process.env.CORS_ORIGIN ,
   credentials: false
}))
app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

<<<<<<< HEAD
//route import
import userRouter from './routes/user.routes.js'

app.use("/api/v1/users",userRouter)
=======
//routes import
import userRouter from './routes/user.routes.js'

app.use("/users",userRouter)
>>>>>>> 6869473dd424849d8d2706bc52202d4fce734492

export {app}