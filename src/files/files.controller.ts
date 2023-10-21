import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  // la funcion fileFilter se crea en los helpers para hacer las validaciones
  @Post('inversor')
  @UseInterceptors( FileInterceptor('image', {
    fileFilter: fileFilter,
    // limite del tamño del archivo, 1 mb y media
    limits: { fileSize: 1500 * 1024 * 1024 },
    // Guardar el archivo en nuestro codigo en la carptea static y dentro de uploads
    // storage: diskStorage({ 
    //   destination: './static/uploads',
      // fileNamer es una funcion de helpers
    //   filename: fileNamer
    // })
  }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {

    console.log(file);

    if ( !file ) {
      throw new BadRequestException('No ha enviado un archivo')
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['png', 'jpg', 'jpeg'];

    // Si el archivo tiene alguna de esta extencion entonces acepta la peticion en el controller
    if ( !validExtensions.includes( fileExtension )){
      throw new BadRequestException({
        message:'La extension del archivo no es la permitida',
        error: "Bad Request",
        statusCode: 400,
        extensiones_permitidas: validExtensions
      })
    }
    
    // return this.filesService.uploadFile();
  }

}
