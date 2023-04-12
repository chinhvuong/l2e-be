import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CertificateListDto } from './dtos/certificate-list.dto';
import { CertificateService } from './certificate.service';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  async getList(@Query() query: CertificateListDto) {
    return this.certificateService.list(query);
  }
}
