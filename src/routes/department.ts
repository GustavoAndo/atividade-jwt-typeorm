import { Router } from "express";
import { department } from "../controllers";

const routes = Router();

routes.post('/', department.create);
routes.put('/', department.update);
routes.delete('/', department.delete);
routes.get('/:user', department.list);

export default routes;