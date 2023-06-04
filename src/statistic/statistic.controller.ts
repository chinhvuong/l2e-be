import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { SupperAdmin } from '@/auth/strategies/supper-admin.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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

  @Get('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  async getUserStatistic() {
    return this.statisticService.userStatistic();
  }

  @Get('handle-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  async handleStatistic() {
    return this.statisticService.handleStatistic();
  }

  @Get('calculate')
  async calculate(@Query() step: number) {
    return this.statisticService.calculate(Number(step) ? Number(step) : 10);
  }
}
