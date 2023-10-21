import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { Auth } from 'src/auth/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InversorDocument } from 'src/files/entities/documentOne.entity';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @UseInterceptors( FilesInterceptor('image') )
  create(
    @Body() createRegisterDto: CreateRegisterDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '(.png|.jpg|.jpeg)',
        })
        .addMaxSizeValidator({
          maxSize: 1500 * 1024 * 1024
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
        ) file: Express.Multer.File[],
  ) {
    let createRegister = {...createRegisterDto, documentImage: file}
    return this.registerService.create(createRegister);
  }

  @Get()
  @Auth()
  findAll() {
    return this.registerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
    return this.registerService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registerService.remove(id);
  }
}
