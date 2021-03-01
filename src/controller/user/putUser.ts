import {Users} from '../../model/users';
import express, {Request, Response} from 'express';
import { verifyToken } from '../../util/token/token';
import { SHA256 } from 'crypto-js';

export const putUser = {
    modify : async(req : Request, res : Response) => {
        console.log("Modify userInfo");
        console.log("req.body : ", req.body);
        
        let parseToken = verifyToken(String(req.headers.authorization));

        if(parseToken){
            type _Decode = {
                id : number;
            }

            let modifyPassword : string = '';

            if(req.body.password) modifyPassword = SHA256(req.body.password,{cfg : process.env.CRYPTO_PASSWORD}).toString();

            let {id} = parseToken as _Decode;
            let userInfo = await Users.findOne({
                where : {id}
            })

            console.log("userInfo : ", userInfo);
            let password = modifyPassword || userInfo?.password;
            let nickname = req.body.nickname || userInfo?.nickname;

            await Users.update({
                password,
                nickname,
            },{
                where : {id}
            })
            .then((result) => {
                console.log("modify Success : ", result);
                res.send({id, message : 'Your info got modified'})
            })
            .catch(err => {
                console.log("err in modify : ", err);
                res.send({message : 'err'})
            }) 
        }else{
            res.status(403).send('Invalid Access Token');
        }
    }
}