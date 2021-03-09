/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Users } from '../../model/users';
import { SHA256 } from 'crypto-js';
import { craeteToken, verifyToken } from "../../util/token/token";
import axios from "axios";


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
                birth_year : req.body.birth_year,
                sex : req.body.sex
            })
            .then((result) => {
                console.log("signup 성공! :", /*result*/);
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
            let birth_year = userInfo.birth_year;
            let sex = userInfo.sex;

            let accessToken =  craeteToken({
                id,
                email,
                nickname,
                birth_year,
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
    },
    socialSignup : async (req: Request, res : Response) => {
        console.log("Social SignUp! : ", req.body);
        axios.get('https://openapi.naver.com/v1/nid/me',{
            headers : {'Authorization' : `Bearer ${req.body.socialToken}`}
        })
        .then(async (result) => {
            console.log("result : ",result.data.resultcode);
            if(result.data.resultcode === '00'){
                let userInfo = await Users.findOne({
                    where : {email : result.data.response.email}
                })
                if(userInfo){
                    console.log("Social - Sign up 아이디 중복");
                    res.status(409).send({message : "This email is already registered"})
                }else{
                    await Users.create({
                        id : null,
                        email : result.data.response.email,
                        sex : result.data.response.gender === 'M',
                        nickname : result.data.response.name,
                        birth_year : result.data.response.birthyear,
                        password : null
                    })
                    .then(() => {
                        console.log("Social Signup 성공!");
                        res.send({message : 'Your Social-Signup completed'})
                    })
                    .catch(err => {
                        console.log("social Login Error : ", err);
                        res.status(404).send({message : 'Error in Social-Signup'})
                    })
                }
            }
        })
        .catch(err => {
            console.log("err : ", err);
            
        })
    },
    socialSignin : async(req : Request, res : Response) => {
        console.log('Social Signin!');
        axios.get('https://openapi.naver.com/v1/nid/me',{
            headers : {'Authorization' : `Bearer ${req.body.socialToken}`}
        })
        .then(async (result) => {
            console.log("Result : ", result.data);
            let userInfo = await Users.findOne({
                where : {email : result.data.response.email}
            })

            if(userInfo){
                let id = userInfo.id;
                let email = userInfo.email;
                let nickname = userInfo.nickname;
                let birth_year = userInfo.birth_year;
                let sex = userInfo.sex;

                let accessToken = craeteToken({
                    id,
                    email,
                    nickname,
                    birth_year,
                    sex,
                    iat : Math.floor(Date.now() / 1000) - 30,
                    exp :Math.floor(Date.now() / 1000) + (60 * 60)
                });

                res.send({data : accessToken, message : "OK"});
            }else{
                //유저 정보가 없을 때
                res.status(404).send('Invalid User');
            }
        })
        .catch(err => {
            console.log("Err in Social Signin");
            res.status(404).send({message : "Err in Social Signin"})
        })
    },
    withoutLogin : async(req : Request, res : Response) => {
        console.log("withoutLogin!");
        console.log(req.body);
        let accessToken = craeteToken({
            id:'guest',
            sex : req.body.sex,
            birth_year : req.body.birth_year,
            iat : Math.floor(Date.now() / 1000) - 30,
            exp :Math.floor(Date.now() / 1000) + (60 * 60)
        })
        res.send({
            message : 'ok',
            accessToken
        })
        
    }
};
