import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBtcPayDto } from './dto/create-btc-pay.dto';
import { UpdateBtcPayDto } from './dto/update-btc-pay.dto';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class BtcPayService {

  // Crear logger en consola para ver errores
  private readonly logger = new Logger('BtcPayService')

  async findAll() {

    let config2 = {
      method: 'GET',
      url: `https://mainnet.demo.btcpayserver.org/api/v1/stores/${process.env.STORE_ID}/payment-requests`,
      headers: { 
        'Authorization': `token ${process.env.TOKEN}`, 
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await axios.request(config2);
      return response.data
    } catch (error) {
      return `Ha fallado algo en la consulta: ${error}`
    }
  }

  async findOne(id: string) {
    let config2 = {
      method: 'GET',
      url: `https://mainnet.demo.btcpayserver.org/api/v1/stores/${process.env.STORE_ID}/payment-requests/${id}`,
      headers: { 
        'Authorization': `token ${process.env.TOKEN}`, 
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await axios.request(config2);
      const data = response.data
      return data
    } catch (error) {
      throw new NotFoundException(`La solicitud de pago con id: '${id}' no existe`)
    }
  }

  async create(createBtcPayDto: CreateBtcPayDto) {
    if( Number(createBtcPayDto.amount) <= 1799) {
      throw new BadRequestException('El monto debe ser mayor a 1800')
    }
    let createPay = {
      ...createBtcPayDto, 
      title: 'Pago de Inversionista', 
      currency: 'EUR', 
      description: 'Estas a punto de convertirte en uno de nuestros grandes inversiores en todo España, ¡Termina el Pago!', 
      allowCustomPaymentAmounts: false,
    }
    const config = {
      method: 'POST',
      url: `https://mainnet.demo.btcpayserver.org/api/v1/stores/${process.env.STORE_ID}/payment-requests`,
      headers: {
      Authorization: `token ${process.env.TOKEN}`,
      'Content-Type': 'application/json'
      },
      data: createPay
    }

    try {
      const response = await axios.request(config);
      const { data } = response;
      return data
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async update(id: string, updateBtcPayDto: UpdateBtcPayDto) {
    const pay = await this.findOne(id);

    if( updateBtcPayDto.amount ) {
      if( Number(updateBtcPayDto.amount) <= 1799) {
        throw new BadRequestException('El monto debe ser mayor a 1800')
      }
    }

    const payment = {
      ...pay,
      amount: updateBtcPayDto.amount ? updateBtcPayDto.amount : pay.amount,
      email: updateBtcPayDto.email ? updateBtcPayDto.email : pay.email,
      expiryDate: updateBtcPayDto.expiryDate ? updateBtcPayDto.expiryDate : pay.expiryDate,
    }

    const config = {
      method: 'PUT',
      url: `https://mainnet.demo.btcpayserver.org/api/v1/stores/${process.env.STORE_ID}/payment-requests/${id}`,
      headers: {
      Authorization: `token ${process.env.TOKEN}`,
      'Content-Type': 'application/json'
      },
      data: payment
    }

    try {
      const response = await axios.request(config);
      const { data } = response;
      return data
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    const config = {
      method: 'DELETE',
      url: `https://mainnet.demo.btcpayserver.org/api/v1/stores/${process.env.STORE_ID}/payment-requests/${id}`,
      headers: {
        Authorization: `token ${process.env.TOKEN}`,
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await axios.request(config);
      const { data } = response;
      let datas = {
        status: 'success',
        code: 200,
        message: `El id '${id}' ha sido eliminado`
      };
      return datas
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private handleExceptions( error: any) {
    if ( error.code === '23505') throw new BadRequestException(error.detail);
      
      this.logger.error(error);

      throw new InternalServerErrorException('Error al crear el registro');
  }
}
