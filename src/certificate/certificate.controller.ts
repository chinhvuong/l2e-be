import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CertificateListDto } from './dtos/certificate-list.dto';
import { CertificateService } from './certificate.service';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { UserDocument } from '@/user/schema/user.schema';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { ClaimCertificateDto } from './dtos/claim-certificate.dto';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  async getList(@Query() query: CertificateListDto) {
    return this.certificateService.list(query);
  }

  @ApiBearerAuth()
  @Post('claim-certificate-signature')
  @UseGuards(JwtAuthGuard)
  async getSignatureToMintCertificate(
    @CurrentUser() user: UserDocument,
    @Body() { courseId }: ClaimCertificateDto,
  ) {
    return this.certificateService.claimCertificate(user, courseId);
  }

  // @ApiBearerAuth()
  @Post('test-upload')
  // @UseGuards(JwtAuthGuard)
  async testUploadCertificate(@Query() { id }: MongoIdDto) {
    return this.certificateService.createCertificateFile(id);
  }
}
