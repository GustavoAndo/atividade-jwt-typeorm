import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm"
import User from "./User";

@Entity({ name: "departments" })
export default class Department {

    @PrimaryGeneratedColumn()
    iddepartment: number;

    @Column({ length: 50, nullable: false })
    name: string;

    @ManyToMany( () => User, (user) => user.departments, {cascade:true} )
    @JoinTable({
        name:"works",
        joinColumn: {
            name: "iddepartment",
            referencedColumnName: "iddepartment"
        },
        inverseJoinColumn: {
            name: "iduser",
            referencedColumnName: "iduser"
        }
    })
    users: User[];
    
}