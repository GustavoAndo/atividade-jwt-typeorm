import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import { authorization } from "../middlewares";
import department from "./department";
import user from "./user";

const routes = Router();

routes.use('/login', UserController.login)
routes.use('/user', authorization, user);
routes.use('/department', authorization, department);
routes.use((req: Request, res: Response) => res.json({ error: "Requisição desconhecida" }));

export default routes;