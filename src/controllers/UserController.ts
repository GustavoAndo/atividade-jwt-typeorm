import { Request, Response } from 'express';
import { ArrayOverlap } from 'typeorm';
import AppDataSource from '../data-source';
import Department from '../entities/Department';
import User, { Profile } from "../entities/User"

class UserController {

  public async create(req: Request, res: Response) {
      const { name, mail, password, idmaster, profile, departments } = req.body;

      if (!name || name.trim().length == 0) {
          return res.json({ error: "Forneça o nome do usuário" });
      }
      if (!mail || mail.trim().length == 0) {
          return res.json({ error: "Forneça o e-mail do usuário" });
      }
      if (!password || password.trim().length == 0) {
          return res.json({ error: "Forneça a senha do usuário" });
      }

      const user = new User();
      user.name = name.trim();
      user.mail = mail.trim();
      user.password = password.trim();
      user.profile = !profile ? "employee" : profile;

      if( idmaster ){
          const master = await AppDataSource.manager.findOneBy(User, { iduser:idmaster });

          if( !master || !master.iduser ){
            return res.json({ error: "Gestor não localizado" });
          }
          if( master.profile !== "manager"){
            return res.json({ error: "O usuário fornecido não possui perfil de gestor" });
          }

          user.master = master;
      }

      if (departments) {
          departments.forEach((async(d) => {
            const department = await AppDataSource.manager.findOneBy(Department, { iddepartment: d.iddepartment })

            if( !department || !department.iddepartment ){
              return res.json({ error: "Departamento não localizado" });
            }

          }))

          user.departments = departments
      }

      const resp: any = await AppDataSource.manager.save(User, user).catch((e) => {
          return { error: e.message }
      })
    
      return res.json(resp);
  }
  
}

export default new UserController();