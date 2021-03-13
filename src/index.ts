/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { userRouter } from './routes/userRouter';
import { songRouter } from './routes/songRouter';
import { scoreRouter } from './routes/scoreRouter';
import { testRouter } from './routes/testRouter';
import { sequelize } from './model';
import { quizRouter } from './routes/quizRouter';
import { countRouter } from './routes/countRouter';
import { VisitCounter } from './model/visitCounter';
import cookieParser from 'cookie-parser';

dotenv.config();
/**
 * App Variables
 */
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
// const HOST: string = process.env.HOST || 'localhost';
const app = express();

/**
 *  App Configuration   //middleware
 */
app.use(cors({
  origin : ["http://localhost:3000","https://laggard.ga"],
  preflightContinue : true,
  credentials : true
}));
app.use(cookieParser());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Occur! ${req.method}, ${req.url}`);
  visitCounter(req, res, next);
  // next();
});
// 라우터 설정
// app.use('/')
app.use('/users', userRouter);
app.use('/songs', songRouter);
app.use('/score', scoreRouter);
app.use('/tests', testRouter);
app.use('/quiz', quizRouter);
app.use('/counter', countRouter);

app.get('/',(req:Request, res: Response) => {
  res.send("Hello! Laggard-Project!");
})

const visitCounter = (req : Request, res : Response, next : NextFunction) => {
  console.log("cookie : ", req.cookies['laggard-visitCounter']);

  // if(!req.cookies['laggard-visitCounter']&& req.method!=='OPTIONS'){
  //   console.log("Visit Counter!");
    
  //   res.cookie("laggard-visitCounter","laggard-visit-Counter-Tool-Cookie",{expires : new Date(Date.now() + 24 * 3600000)});
  //   VisitCounter.increment({counter : 1},{where : {id : 1}})
  //   .then(result => {
  //     console.log("visitCounter + 1");
  //   })
  //   .catch(err => {
  //     console.log("Err in visitCounter");
  //   })
  // }
  
  next();
}

/**
 * Server Activation
 */
app.listen(PORT, async () => {
  console.log(`Server Listening on ${PORT}`);

  // //sequelize-db 연결 테스트
  // await sequelize.authenticate()
  // .then(async () => {
  //     console.log("connection success");
  // })
  // .catch((e) => {
  //     console.log('TT : ', e);
  // })
  //TEST!!!
  //ab
});

export { app };
