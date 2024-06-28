import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesController } from './controllers/employees.controller';
import { EmployeesService } from './services/employees.service';
import { Employee } from './entities/employee.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';
import { Department } from './entities/department.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User, Department]),
    LoggerModule,
  ],
  providers: [EmployeesService, UsersService, DepartmentsService],
  controllers: [EmployeesController, UsersController, DepartmentsController],
  exports: [UsersService],
})
export class EmployeesModule {}
