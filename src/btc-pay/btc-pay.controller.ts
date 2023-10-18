import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BtcPayService } from './btc-pay.service';
import { CreateBtcPayDto } from './dto/create-btc-pay.dto';
import { UpdateBtcPayDto } from './dto/update-btc-pay.dto';

@Controller('btc-pay')
export class BtcPayController {
  constructor(private readonly btcPayService: BtcPayService) {}

  @Post()
  create(@Body() createBtcPayDto: CreateBtcPayDto) {
    return this.btcPayService.create(createBtcPayDto);
  }

  @Get()
  findAll() {
    return this.btcPayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.btcPayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBtcPayDto: UpdateBtcPayDto) {
    return this.btcPayService.update(+id, updateBtcPayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.btcPayService.remove(+id);
  }
}
