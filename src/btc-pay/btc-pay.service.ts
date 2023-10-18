import { Injectable } from '@nestjs/common';
import { CreateBtcPayDto } from './dto/create-btc-pay.dto';
import { UpdateBtcPayDto } from './dto/update-btc-pay.dto';

@Injectable()
export class BtcPayService {
  create(createBtcPayDto: CreateBtcPayDto) {
    return 'This action adds a new btcPay';
  }

  findAll() {
    return `This action returns all btcPay`;
  }

  findOne(id: number) {
    return `This action returns a #${id} btcPay`;
  }

  update(id: number, updateBtcPayDto: UpdateBtcPayDto) {
    return `This action updates a #${id} btcPay`;
  }

  remove(id: number) {
    return `This action removes a #${id} btcPay`;
  }
}
