/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Users } from '../../model/users';
import { SHA256 } from 'crypto-js';
import { craeteToken, verifyToken } from "../../util/token/token";


 /**
 * Controller Definitions
 */

export const postUser = {
    signup : async (req : Request, res : Response) => {
        console.log("signup");
  
        let hashPassword = SHA256(req.body.password,{cfg : process.env.CRYPTO_PASSWORD}).toString();
        let duplicateTest = await Users.findOne({
            where : {email : req.body.email}
        })
        
        if(!duplicateTest){
            Users.create({
                id : null,
                email : req.body.email,
                password : hashPassword,
                nickname : req.body.nickname,
                age : req.body.age,
                sex : req.body.sex
            })
            .then((result) => {
                console.log("signup 성공! :", result);
                res.send({message : "Your sign-up completed"});
            })
            .catch(err => {
                console.log("실패 : ", err);
                res.status(404).send({message : "Error in sign-up"})
            }) 
        }else{
            res.status(409).send({message : "This email is already registered"})
        }
    },

    signin : async ( req : Request, res : Response ) => {
        console.log("Basic Sign in (Log in)");
        console.log("req.body : ", req.body);
        
        let hashPassword = SHA256(req.body.password,{cfg : process.env.CRYPTO_PASSWORD}).toString();

        let userInfo = await Users.findOne({
            where : {
                email : req.body.email,
                password : hashPassword
            }
        })        

        if(userInfo){
            let id = userInfo.id;
            let email = userInfo.email;
            let nickname = userInfo.nickname;
            let age = userInfo.age;
            let sex = userInfo.sex;

            let accessToken =  craeteToken({
                id,
                email,
                nickname,
                age,
                sex,
                iat : Math.floor(Date.now() / 1000) - 30,
                exp :Math.floor(Date.now() / 1000) + (60 * 60)
            })
            console.log("accessToken : ", accessToken);
            res.send({
                data : accessToken,
                message : "ok"
            })
        }else{
            res.status(403).send({message : "Invalid user id or password"});
        }        
    },

    signout : async ( req : Request, res : Response) => {
        console.log("Log out");
        console.log("req.headers : ", req.headers);
        
        let userInfo = verifyToken(String(req.headers.authorization));
        if(userInfo){
            delete req.headers['authorization'];
            res.send({message : "You're logged out"});
        }else{
            res.status(403).send({message : "Not authorized"});
        }
    },

    checkEmailDuplicate : async (req : Request, res : Response) => {
        console.log("check Email Duplicated");

        let userInfo = await Users.findOne({
            where : {email : req.body.email}
        })

        if(userInfo){
            res.status(409).send({message : "This email is already registered"});
        }else{
            res.status(200).send({message : "You can use this email"});
        }
    }
};
