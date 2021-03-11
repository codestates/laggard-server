/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { Users } from "../../model/users";
import { verifyToken } from "../../util/token/token";

 /**
 * Controller Definitions
 */

export const deleteUser = {
  unregisterUser : async(req : Request, res : Response) => {
    console.log("unRegisterUser!!");
    console.log("req.headers.authorization : ", req.headers.authorization);
    
    try{
      const parsedToken = verifyToken(String(req.headers.authorization));
      console.log(parsedToken);
      type parsedTokenProps = {
        id : any
      }
      let {id} = parsedToken as parsedTokenProps;
      console.log("id : ", id);
      
      if(parsedToken && id !== 'guest'){
        Users.destroy({
          where : {id : Number(id)}
        })
        .then(result => {
          console.log("회원탈퇴 성공");
          res.status(200).send({message : "ok"})
        })
        .catch(err => {
          console.log("Err in unregisterUser : ", err);
          res.status(404).send({message : "Err in unregister User"});
        })
      }else{
        res.status(409).send({message : "Invalid User"});
      }

    }catch(e) {
      res.status(404).send({message : "Err in unregister User"})
    }
    
  }
}