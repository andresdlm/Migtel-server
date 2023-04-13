import { Injectable } from '@nestjs/common';

import { ReportsLogicService } from './reports-logic.service';

@Injectable()
export class ReportsService {
  constructor(private reportsLogicService: ReportsLogicService) {}
}
