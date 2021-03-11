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
userRouter.post('/signup/basic',controller.default.postUser.signup);
userRouter.post('/signin/basic',controller.default.postUser.signin);
userRouter.post('/signout', controller.default.postUser.signout);
userRouter.post('/signup/emailCheck', controller.default.postUser.checkEmailDuplicate);
userRouter.post('/signup/social', controller.default.postUser.socialSignup);
userRouter.post('/signin/social', controller.default.postUser.socialSignin);
userRouter.post('/signin/withoutLogin', controller.default.postUser.withoutLogin);

//PUT
userRouter.put('/userinfo', controller.default.putUser.modify);

//DELETE
userRouter.delete('/unregister', controller.default.deleteUser.unregisterUser);

 
 export {userRouter};