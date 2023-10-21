

export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {

    if ( !file ) return callback( new Error( 'No ha enviado ningun archivo' ), false)
    
    // El mimetype nos dice que tipo de archivo es
    const fileExtension = file.mimetype.split('/')[1];
    // Validamos que sea una extension valida
    const validExtensions = ['png', 'jpg', 'jpeg'];

    // Si el archivo tiene alguna de esta extencion entonces acepta la peticion en el controller
    if ( validExtensions.includes( fileExtension )){
        return callback( null, true)
    }

    if ( !validExtensions.includes( fileExtension )){
        return callback( null, true)
    }

    // No aceptes la peticion en el controller
    callback( null, false );
}