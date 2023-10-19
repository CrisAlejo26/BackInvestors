import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BtcPayService } from './btc-pay.service';
import { CreateBtcPayDto } from './dto/create-btc-pay.dto';
import { UpdateBtcPayDto } from './dto/update-btc-pay.dto';

@Controller('btcPay')
export class BtcPayController {
  constructor(private readonly btcPayService: BtcPayService) {}

  @Get()
  findAll() {
    return this.btcPayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.btcPayService.findOne(id);
  }

  @Post()
  create(@Body() createBtcPayDto: CreateBtcPayDto) {
    return this.btcPayService.create(createBtcPayDto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBtcPayDto: UpdateBtcPayDto) {
    return this.btcPayService.update(id, updateBtcPayDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.btcPayService.remove(id);
  }
}
