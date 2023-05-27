import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { SupperAdmin } from '@/auth/strategies/supper-admin.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatisticService } from './statistic.service';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  async getDayStatistic() {
    return this.statisticService.getBasicStatistic();
  }

  @Get('data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  async getDataStatistic() {
    return this.statisticService.getStatisticData();
  }

  @Get('course')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  async getCourseStatistic() {
    return this.statisticService.courseStatistic();
  }
  @Get('handle-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  async handleStatistic() {
    return this.statisticService.handleStatistic();
  }
}
