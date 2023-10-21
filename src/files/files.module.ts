import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorDocument } from './entities/documentOne.entity';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    // Importamos la tabla de User.entity
    TypeOrmModule.forFeature([ InversorDocument ]),
  ]
})
export class FilesModule {}
