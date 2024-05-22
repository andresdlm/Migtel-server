import { Department } from "./department.model";
import { User } from "./user.model";

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  document: string;
  city: string;
  department: Department;
  departmentId: number;
  position: string;
  birthday: Date;
  active: boolean;
  user?: User;
  createAt: Date;
  updateAt: Date;
}
