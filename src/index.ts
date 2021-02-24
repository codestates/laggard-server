/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express,{Request, Response, NextFunction} from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { songRouter } from "./routes/songRouter";
import { scoreRouter } from "./routes/scoreRouter";


dotenv.config();
/**
 * App Variables
 */
const PORT:number = parseInt(process.env.PORT as string, 10) || 5000;
const HOST:string = process.env.HOST || 'localhost';
const app = express();

/**
 *  App Configuration   //middleware
 */
app.use(cors());
app.use(express.json());
app.use((req:Request,res:Response,next:NextFunction) => {
    console.log(`Request Occur! ${req.method}, ${req.url}`);
    next();
})
// 라우터 설정
// app.use('/')
app.use('/users',userRouter);
app.use('/songs',songRouter);
app.use('/score',scoreRouter);

/**
 * Server Activation
 */
app.listen(PORT,HOST,() => {
    console.log(`Server Listening on ${HOST}:${PORT}`);
    
})