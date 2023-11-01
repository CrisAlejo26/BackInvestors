import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BtcPayService } from './btc-pay.service';
import { CreateBtcPayDto } from './dto/create-btc-pay.dto';
import { UpdateBtcPayDto } from './dto/update-btc-pay.dto';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { Auth } from '../auth/decorators';

@Controller('btcPay')
export class BtcPayController {
  constructor(private readonly btcPayService: BtcPayService) {}

  @Get()
  @Auth( ValidRoles.Admin )
  findAll() {
    return this.btcPayService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.Admin )
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.btcPayService.findOne(id);
  }

  @Post()
  create(@Body() createBtcPayDto: CreateBtcPayDto) {
    return this.btcPayService.create(createBtcPayDto);
  }

  @Patch(':id')
  @Auth( ValidRoles.Admin )
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBtcPayDto: UpdateBtcPayDto) {
    return this.btcPayService.update(id, updateBtcPayDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.Admin )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.btcPayService.remove(id);
  }
}
