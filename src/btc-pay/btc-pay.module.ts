import { Module } from '@nestjs/common';
import { BtcPayService } from './btc-pay.service';
import { BtcPayController } from './btc-pay.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BtcPayController],
  providers: [BtcPayService],
  imports: [AuthModule]
})
export class BtcPayModule {}
