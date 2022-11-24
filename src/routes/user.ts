import { Router } from "express";
import { user } from "../controllers";

const routes = Router();

routes.post('/', user.create);
routes.put('/', user.update);
routes.delete('/', user.delete);
routes.get('/:profile/:department', user.list);

export default routes;