/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Songs } from "../../model/songs";
import { Users } from "../../model/users";
import { getAudioBuffer } from "../../util/audio/audio";
import { verifyToken } from "../../util/token/token";
import { QueryTypes, Op } from 'sequelize';
import { sequelize } from "../../model";
import { getRandomLyrics } from "../../util/lyrics/lyrics";

 /**
 * Controller Definitions
 */

 export const postQuiz = {
   getAudio : async(req : Request, res : Response) => {
    console.log("getAudio!");
    console.log("req : ", req.body);
    console.log("req.body.lyrics", req.body.lyrics);
    
    let audioBuffer = await getAudioBuffer(req.body.lyrics);
    res.send(audioBuffer);

   }
}