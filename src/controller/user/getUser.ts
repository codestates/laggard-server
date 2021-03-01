/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { verifyToken } from "../../util/token/token";

 /**
 * Controller Definitions
 */

export const getUser = {
    userInfo : (req : Request, res : Response) => {
        console.log("getUser");
        
        let parseToken = verifyToken(String(req.headers.authorization));
        
        if(parseToken){
            type _Decode = {
                id : number;
                email : string;
                nickname : string;
                age : number;
                sex : boolean;
            }

            const {id, email, nickname, age, sex} = parseToken as _Decode;
            
            let userInfo : Object = {
                id,
                email,
                nickname,
                age,
                sex
            }
            res.send({
                userInfo,
                message : "ok"
            })
        }else{
            res.status(403).send({message  : "Invalid access token"});
        }

    }
};
