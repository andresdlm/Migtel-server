import { Employee } from "./employee.model";

export interface User {
  id: number;
  username: string;
  role: 'super_admin' | 'admin' | 'operator' | 'reader';
  active: boolean;
  employee: Employee;
  crmId: string
  createAt: string;
  updateAt: string;
}
