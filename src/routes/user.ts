import { Router } from "express";
import { user } from "../controllers";

const routes = Router();

routes.post('/', user.create);
routes.put('/', user.update);

export default routes;