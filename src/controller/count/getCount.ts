/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import {VisitCounter} from '../../model/visitCounter';

 /**
 * Controller Definitions
 */
export const getCount = {
  visitCounter : async(req: Request, res: Response) => {
    VisitCounter.findOne({
      where : {id : 1}
    })
    .then(result => {
      console.log("success access visitCounter ");
      res.send({
        counter : result?.counter,
        message : "ok"
      })
    })
    .catch(err => {
      console.log("Err in visitCounter : ", err);
      res.status(404).send({message : "Err in visitCounter"})
    })
  }
}