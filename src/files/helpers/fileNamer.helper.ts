import { Request } from 'express';
import { Express } from 'express-serve-static-core';
import { v4 as uuid } from 'uuid'

export const fileNamer = (req: Request & { file: Express.Multer.File }, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    if (!file) return callback(new Error('No ha enviado ningún archivo'), '');
    
    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${ uuid() }.${fileExtension}`;
    
    return callback(null, fileName);
};