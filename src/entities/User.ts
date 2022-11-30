import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, ManyToMany } from "typeorm"
import * as bcrypt from "bcrypt"
import Department from "./Department";

export type Profile = 'employee' | 'manager' | 'admin'

@Entity({ name: "users" })
export default class User {

    @PrimaryGeneratedColumn()
    iduser: number;

    @Column({ length: 50, nullable: false })
    name: string;
    
    @Column({ length: 50, nullable: false })
    mail: string;

    @Column({ nullable: false, select: false })
    password: string;

    // @Column({type:'enum', enum:['employee', 'manager', 'admin'], default:'employee', nullable:false})
    // profile: Profile;

    @Column({ default: 'employee', nullable: false })
    profile: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: true })
    @JoinColumn({ 
        name: "idmaster",
        referencedColumnName: "iduser",
        foreignKeyConstraintName: "fk_master_id"
    })
    master: User;

    @ManyToMany(() => Department, (department) => department.users)
    departments: Department[];

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
        }
    }
    
    compare(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
    
}