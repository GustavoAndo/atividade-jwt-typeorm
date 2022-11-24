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


  public async update(req: Request, res: Response): Promise<Response> {
    const { iduser, name, mail, idmaster, profile, departments } = req.body;

    if( !iduser ){
      return res.json({error:"Forneça o identificador do usuário"});
    }

    const user = await AppDataSource.manager.findOneBy(User, { iduser }).catch((e) => e.message);

    if (user && user.iduser) {
      user.name = !name || name.trim() === '' ? user.name : name.trim();
      user.mail = !mail || mail.trim() === '' ? user.mail : mail.trim();
      user.profile = !profile || profile.trim() === '' ? user.profile : profile.trim();

      if(idmaster == iduser){
        return res.json({error:"O usuário não pode ser gestor de si mesmo"});
      }

      if(idmaster){
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

      const newUser = await AppDataSource.manager.save(User, user).catch((e) => {
        return e.message;
      })

      return res.json(newUser);
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

  
  public async delete(req: Request, res: Response): Promise<Response> {
    const { iduser } = req.body;

    if( !iduser || iduser.trim() === "" ){
      return res.json({error:"Forneça o identificador do usuário"});
    }

    const user = await AppDataSource.manager.findOneBy(User, { iduser: Number(iduser) }).catch((e) => e.message);

    if (user && user.iduser) {
      const userDeleted = await AppDataSource.manager.remove(User, user).catch((e) => e.message)
      return res.json(userDeleted)
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }


}

export default new UserController();