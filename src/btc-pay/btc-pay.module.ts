import { Module } from '@nestjs/common';
import { BtcPayService } from './btc-pay.service';
import { BtcPayController } from './btc-pay.controller';

@Module({
  controllers: [BtcPayController],
  providers: [BtcPayService],
})
export class BtcPayModule {}
