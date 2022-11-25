import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import Department from '../entities/Department';
import User, { Profile } from "../entities/User"
import { generateToken } from '../middlewares';

class UserController {

  public async login(req: Request, res: Response): Promise<Response> {
    const { mail, password } = req.body;

    const user = await AppDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .select()
      .addSelect('user.password')
      .where("user.mail=:mail", { mail })
      .getOne();

    if (user && user.iduser) {
      const r = await user.compare(password);
      if (r) {
        const token = await generateToken({ id: user.iduser, perfil: user.profile })
        return res.json({
          name: user.name,
          profile: user.profile,
          token
        })
      }
      return res.json({ error: "Dados de login não conferem" });
    }
    else {
      return res.json({ error: "Usuário não localizado" });
    }
  }


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


  public async list(req: Request, res: Response): Promise<Response> {
    let { profile, department } = req.params;
    const _profile = profile as Profile;

    if (profile !== 'employee' && profile !== 'manager' && profile !== 'admin'){
      return res.json({ error: "Valor inválido para perfil. Forneça employee, manager ou admin"})
    }

    if (department === 'false' || department === 'true') {
      if (department === 'false') {
        department = ""
      } 
    } else {
      return res.json({ error: "Valor inválido para departamento. Forneça true ou false"})
    }

    const users = await AppDataSource.getRepository(User).find({
      where: {
        profile: _profile,
      },
      relations: {
        departments: Boolean(department)
      },
      order: {
        name: 'asc'
      }
    });

    return res.json(users);
  }


  public async updatePassword(req: Request, res: Response): Promise<Response> {
    const { password } = req.body;
    const { id } = res.locals;

    if (!password || password.trim().length == 0) {
      return res.json({ error: "Forneça a nova senha" });
    }

    const user = await AppDataSource.manager.findOneBy(User, { iduser:id });

    if (user && user.iduser) {
      user.password = password.trim();

      const newUser = await AppDataSource.manager.save(User, user);
      return res.json(newUser);
    }
    else {
      return res.json({ error: "Colaborador não localizado" })
    }
  }

}

export default new UserController();