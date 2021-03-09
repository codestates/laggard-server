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
 quizRouter.get('/songInfo',controller.getQuiz.songInfo);
//  quizRouter.get('/audioFile', controller.getQuiz.getAudio);
quizRouter.get('/recordResult',controller.getQuiz.recordResult);
quizRouter.get('/submitScore',controller.getQuiz.submitScore);
 
 //POST
 quizRouter.post('/audioFile', controller.postQuiz.getAudio);


//PUT


 
 export {quizRouter};