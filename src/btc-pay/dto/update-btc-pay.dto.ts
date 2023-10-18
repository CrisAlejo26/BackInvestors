import { PartialType } from '@nestjs/mapped-types';
import { CreateBtcPayDto } from './create-btc-pay.dto';

export class UpdateBtcPayDto extends PartialType(CreateBtcPayDto) {}
