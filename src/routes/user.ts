import { Router } from "express";
import { user } from "../controllers";
import { authManager } from "../middlewares";

const routes = Router();

routes.post('/', authManager, user.create);
routes.put('/', authManager, user.update);
routes.delete('/', authManager, user.delete);
routes.get('/:profile/:department', user.list);

export default routes;