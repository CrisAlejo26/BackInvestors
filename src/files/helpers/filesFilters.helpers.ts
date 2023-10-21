
export const filesFilters = (req: Request, files: Express.Multer.File[], callback: Function) => {
    if (!files || files.length === 0) return callback(new Error('No ha enviado ningún archivo'), false);

    const validExtensions = ['png', 'jpg', 'jpeg'];

    for (let file of files) {
        const fileExtension = file.mimetype.split('/')[1];

        if (!validExtensions.includes(fileExtension)) {
        return callback(null, false);
        }
    }

    callback(null, true);
}
