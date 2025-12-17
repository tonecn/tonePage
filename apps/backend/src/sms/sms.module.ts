import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsRecord } from './entity/sms-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmsRecord])],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService],
})
export class SmsModule { }
