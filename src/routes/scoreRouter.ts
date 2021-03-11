/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import * as controller from '../controller/score';

/**
 * Router Definition
 */
const scoreRouter = express.Router();

/**
 * Controller Definitions
 */

//GET
scoreRouter.get('/rank', controller.default.getTotalRank);

export { scoreRouter };
