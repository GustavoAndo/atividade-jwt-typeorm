import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const generateToken = async user => jwt.sign(user, process.env.JWT_SECRET);

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    try {
        const token = authorization.replace("Bearer ","");

        const decoded = <{id:string,perfil:string}>jwt.verify(token, process.env.JWT_SECRET);
        if( !decoded || !decoded.id ){
            res.status(401).send({error:"Token de autorização incorreto"});
        }
        else{
            res.locals = {id: decoded.id, perfil:decoded.perfil};
        }
    } catch (error) {
        return res.status(401).send({error:"Não autorizado"});
    }
    
    return next();
};