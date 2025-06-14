import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
  imports: [NotificationModule],
})
export class VerificationModule {}
