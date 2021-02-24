/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import * as controller from '../controller/user';

/**
 * Router Definition
 */
const userRouter = express.Router();

/**
 * Controller Definitions
 */

 //GET
userRouter.get("/userinfo",controller.default.getUser.userInfo);

//POST
userRouter.post('signup',controller.default.postUser.signup);

 
 export {userRouter};