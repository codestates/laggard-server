/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";

 /**
 * Controller Definitions
 */

export const getUser = {
    userInfo : (req : Request, res : Response) => {
        console.log("getUser");
        res.send({
            message : "getUser"
        })
    }
};
