import { Router, Request, Response } from "express";
import department from "./department";
import user from "./user";

const routes = Router();

routes.use('/user', user);
routes.use('/department', department);
routes.use((req: Request, res: Response) => res.json({ error: "Requisição desconhecida" }));

export default routes;