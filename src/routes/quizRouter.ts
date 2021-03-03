/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import * as controller from '../controller/quiz';

/**
 * Router Definition
 */
const quizRouter = express.Router();

/**
 * Controller Definitions
 */

 //GET
quizRouter.get('/audioFile', controller.getQuiz.getAudio);

//POST


//PUT


 
 export {quizRouter};