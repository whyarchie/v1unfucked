import express from "express"
import mainRouter from "./mainRouter"
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/globalErrorHandler"
const app = express()
const PORT = Number(process.env.PORT) || 3000
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/', mainRouter)
app.get('/health', (req, res) => {
    res.status(200).json({
        msg: "Yes baby! server is up and running"
    })
})
app.use(globalErrorHandler)

app.listen(PORT, () => console.log(`[ READY ] Server is running at http://localhost:${PORT}`))

process.on('exit', (code) => console.log('Exited with code', code));
process.on('uncaughtException', e => console.log('Uncaught', e));
