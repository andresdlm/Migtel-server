import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import { FilterByTags } from '../dtos/filter.dtos';
import {
  MassByTagDTO,
  MassEmailDTO,
  MassSMSDTO,
  PaymentRecievedSMSDTO,
  SingleEmailDTO,
  SingleSMSDTO,
} from '../dtos/notify.dtos';
import { NotifyService } from '../services/notify.service';
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';
import { Blacklist, CreateBlacklistDto, UpdateBlacklistDto } from '../dtos/blacklist.dtos';
import { BlacklistService } from '../services/blacklist.service';
import { Observable } from 'rxjs';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('notify')
export class NotifyController {
  constructor(private notifyService: NotifyService, private blacklistService: BlacklistService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Get('getClientTags')
  getClientTags() {
    return this.notifyService.getClientTags();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('getFilteredClients')
  getFilteredClients(@Body() payload: FilterByTags) {
    return this.notifyService.getFilteredClients(payload);
  }

  /*******
   * SMS *
   ******/

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('singleSMS')
  singleSMS(@Body() payload: SingleSMSDTO) {
    return this.notifyService.singleSMS(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massSMS')
  massSMS(@Body() payload: MassSMSDTO) {
    return this.notifyService.massSMS(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('paymentRecievedSMS')
  paymentRecievedSMS(@Body() payload: PaymentRecievedSMSDTO) {
    return this.notifyService.paymentRecievedSMS(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massByTagSMS')
  massByTagSMS(@Body() payload: MassByTagDTO) {
    return this.notifyService.massByTagSMS(payload);
  }

  /*********
   * Email *
   ********/

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('singleEmail')
  singleEmail(@Body() payload: SingleEmailDTO) {
    return this.notifyService.singleEmail(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massEmail')
  massEmail(@Body() payload: MassEmailDTO) {
    return this.notifyService.massEmail(payload);
  }


  /************
  * Blacklist *
  ************/

  @Get('blacklist')
  private getAll(): Observable<Blacklist[]> {
    return this.blacklistService.getAll();
  }

  @Get('blacklist/deleted')
  private getAllDeleted(): Observable<Blacklist[]> {
    return this.blacklistService.getAllDeleted();
  }

  @Get('blacklist/:id')
  private getOne(@Param('id') id: number): Observable<Blacklist> {
    return this.blacklistService.getOne(id);
  }

  @Post('blacklist')
  private add(@Body() payload: CreateBlacklistDto): Observable<Blacklist> {
    return this.blacklistService.add(payload);
  }

  @Patch('blacklist/:id')
  private update(@Param('id') id: number, @Body() payload: UpdateBlacklistDto): Observable<Blacklist> {
    return this.blacklistService.update(id, payload);
  }

  @Delete('blacklist/:id')
  private softRemove(@Param('id') id: number): Observable<Blacklist> {
    return this.blacklistService.softRemove(id);
  }

  @Delete('blacklist/remove/:id')
  private remove(@Param('id') id: number): Observable<Blacklist> {
    return this.blacklistService.remove(id);
  }

  @Post('blacklist/restore/:id')
  private restore(@Param('id') id: number): Observable<Blacklist> {
    return this.blacklistService.restore(id);
  }
}
