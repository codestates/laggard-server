/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";

 /**
 * Controller Definitions
 */

export const postUser = {
    signup : (req : Request, res : Response) => {
        console.log("signup");
        res.send({
            message : "signup"
        })
    }
};
