import { Router } from "express";
import { department } from "../controllers";
import { authAdmin } from "../middlewares";

const routes = Router();

routes.post('/', authAdmin, department.create);
routes.put('/', authAdmin, department.update);
routes.delete('/', authAdmin, department.delete);
routes.get('/:user', department.list);

export default routes;