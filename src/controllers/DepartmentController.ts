import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import Department from "../entities/Department"

class DepartmentController {

    public async create(req: Request, res: Response) {
        const { name } = req.body;

        if (!name || name.trim().length == 0) {
            return res.json({ error: "Forneça o nome do departamento" });
        }

        const department = new Department();
        department.name = name.trim();

        const newDepartament = await AppDataSource.manager.save(Department, department).catch((e) => {
            return { error: e.message }
        })
      
        return res.json(newDepartament);
    }
    
    
  public async update(req: Request, res: Response): Promise<Response> {
    const { iddepartment, name } = req.body;

    if( !iddepartment ){
      return res.json({error:"Forneça o identificador do departamento"});
    }

    const departament = await AppDataSource.manager.findOneBy(Department, { iddepartment });

    if (departament && departament.iddepartment) {
      departament.name = !name || name.trim() === '' ? departament.name : name.trim();

      const newDepartament = await AppDataSource.manager.save(Department, departament).catch((e) => {
        return e.message;
      })

      return res.json(newDepartament);
    }
    else {
      return res.json({ error: "Departamento não localizado" })
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { iddepartment } = req.body;

    if(!iddepartment){
      return res.json({error:"Forneça o identificador do departamento"});
    }

    const departament = await AppDataSource.manager.findOneBy(Department, { iddepartment: Number(iddepartment) });

    if (departament && departament.iddepartment) {
      const departmentDeleted = await AppDataSource.manager.remove(Department, departament).catch((e) => e.message)
      return res.json(departmentDeleted)
    }
    else {
      return res.json({ error: "Departamento não localizado" })
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    let { user } = req.params;

    if (user === 'false' || user === 'true') {
      if (user === 'false') {
        user = ""
      } 
    } else {
      return res.json({ error: "Valor inválido para usuário. Forneça true ou false"})
    }

    const users = await AppDataSource.getRepository(Department).find({
      relations: {
        users: Boolean(user)
      },
      order: {
        name: 'asc'
      }
    });

    return res.json(users);
  }

}

export default new DepartmentController();