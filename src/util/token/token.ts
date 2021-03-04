import * as jwt from 'jsonwebtoken';

const craeteToken = ( info:object ) => {
    let token = jwt.sign(info,process.env.ACCESS_SECRET||'token salt key');
    return token; 
}

const verifyToken = (authorization : string) => {
    let token = authorization.split(" ")[1];

    try{
        let info : Object = jwt.verify(token, process.env.ACCESS_SECRET|| 'token salt key');
        return info;
    }catch(e){
        return null;
    }
}
//a



export {craeteToken, verifyToken};