import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesController } from './controllers/employees.controller';
import { EmployeesService } from './services/employees.service';
import { Employee } from './entities/employee.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User])],
  providers: [EmployeesService, UsersService],
  controllers: [EmployeesController, UsersController],
  exports: [UsersService],
})
export class EmployeesModule {}
