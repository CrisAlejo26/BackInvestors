import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InversorDocument } from './entities/documentOne.entity';

@Injectable()
export class FilesService {

    constructor(
        @InjectRepository(InversorDocument) 
        documentRepository: Repository<InversorDocument>
    ){}

    async uploadFile(img: InversorDocument ) {

    }
}
