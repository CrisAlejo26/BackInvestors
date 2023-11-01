import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorRegister } from './entities/register.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [
    TypeOrmModule.forFeature([ InversorRegister ]),
    AuthModule
  ],
  exports: [ TypeOrmModule, RegisterService ]
})
export class RegisterModule {}
