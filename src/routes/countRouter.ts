/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import * as controller from '../controller/count';

/**
 * Router Definition
 */
const countRouter = express.Router();

/**
 * Controller Definitions
 */

 //GET
  countRouter.get('/visitCounter', controller.getCount.visitCounter);

 
 export {countRouter};