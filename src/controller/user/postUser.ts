/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Users } from '../../model/users';

 /**
 * Controller Definitions
 */

export const postUser = {
    signup : async (req : Request, res : Response) => {
        console.log("signup");

        console.log(req.body);
        
        Users.create({
            email : req.body.email,
            password : req.body.password,
            nickname : req.body.nickname,
            age : req.body.age,
            sex : req.body.sex
        })
        .then((result) => {
            console.log("성공! :", result);
        })
        .catch(err => {
            console.log("실패 : ", err);
        }) 

        // res.send({
        //     message : "signup"
        // })
    }
};
