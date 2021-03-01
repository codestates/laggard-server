/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import * as controller from '../controller/test';

/**
 * Router Definition
 */
const testRouter = express.Router();

/**
 * Controller Definitions
 */

//Router test (삭제 예정)
// testRouter.get("/", (req: express.Request, res: express.Response) => {
//   res.send("hello")
// })

//GET
testRouter.get('/', controller.default.getTestSheet);

//POST
// testRouter.post('/signup',controller.default.postUser.signup);

export { testRouter };
