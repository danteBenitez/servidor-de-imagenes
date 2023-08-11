const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { uploader } = cloudinary;

/**
 *  @typedef {import("express-fileupload").UploadedFile} UploadedFile
 *  @typedef {import("cloudinary").UploadApiResponse} UploadApiResponse
 */

/** Función que sube un archivo a la nube utilizando Cloudinary

    @param {UploadedFile} file El archivo como objeto retornado por req.files
    @param {number} publicId ID a usar como public_id al subir el archivo
    @return {Promise<UploadApiResponse>}. 
    Objeto retornado por cloudinary con información del archivo
    subido. 
**/
async function upload(file, publicId) {
    // Obtenemos el path temporal al archivo para subirlo
    const tempPath = file.tempFilePath;
    console.log("Temp path of the file: ", tempPath);

    return uploader.upload(tempPath, {
        overwrite: false,
        public_id: publicId
    });
}

module.exports = {
    upload,

}