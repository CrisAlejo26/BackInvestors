import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { Auth } from 'src/auth/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InversorDocument } from 'src/files/entities/documentOne.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

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

    const documents: InversorDocument[] = file.map((f) => {
      const doc = new InversorDocument();
      doc.type = f.mimetype;
      doc.name = `${createRegisterDto.fullName}_dni.${f.mimetype.split('/')[1]}`;
      doc.data = f.buffer;
      return doc;
    });
  
    createRegisterDto.documentImage = documents;

    return this.registerService.create(createRegisterDto);
  }

  @Get()
  @Auth( ValidRoles.Admin )
  findAll() {
    return this.registerService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.Admin )
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registerService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.Admin )
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
    return this.registerService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.Admin )
  remove(@Param('id') id: string) {
    return this.registerService.remove(id);
  }
}
