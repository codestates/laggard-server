/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Users } from "../../model/users";
import { verifyToken } from "../../util/token/token";

 /**
 * Controller Definitions
 */

export const getUser = {
    userInfo : async (req : Request, res : Response) => {
        console.log("getUser");
        
        let parseToken = verifyToken(String(req.headers.authorization));
        
        if(parseToken){
            type _Decode = {
                id : number;
                email : string;
                nickname : string;
                birth_year : number;
                sex : boolean;
            }

            // const {id, email, nickname, age, sex} = parseToken as _Decode;
            
            // let userInfo : Object = {
            //     id,
            //     email,
            //     nickname,
            //     age,
            //     sex
            // }
            // res.send({
            //     userInfo,
            //     message : "ok"
            // })
            const {id} = parseToken as _Decode;
        
            await Users.findOne({
                where : {id}        
            })
            .then(result => {
                // console.log("result : ", result);
                type _userInfo = {
                    id : number;
                    email : string;
                    nickname : string;
                    birth_year : number;
                    sex : boolean;
                }
                if(result){
                    const userInfoId = result.getDataValue("id") ;
                    const userInfoEmail = result.getDataValue("email");
                    const userInfoNickname = result.getDataValue("nickname");
                    const userInfoBirth_year = result.getDataValue("birth_year");
                    const userInfoSex = result.getDataValue('sex');
                    res.send({
                        message : "Ok",
                        data : {
                            userInfo : {
                                id : userInfoId,
                                email : userInfoEmail,
                                nickname : userInfoNickname,
                                birth_year : userInfoBirth_year,
                                sex : userInfoSex
                            }
                        }
                    })
                }else{
                    res.status(404).send({message : "Error in modify User info"});
                }
            })
            .catch(err => {
                console.log("err : ", err);
                res.status(404).send({message : "Error in modify User info"})
            })
        }else{
            res.status(403).send({message  : "Invalid access token"});
        }

    }
};
