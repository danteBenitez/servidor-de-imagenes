const path = require('path');
const Image = require('../models/image.js');
const isImage = require('../utils/isImage.js');

// Directorio en el que guardar las imágenes subidas localmente
const IMAGE_PATH = '../images';

function renderForm(_req, res) {
    res.render('upload');
}

async function uploadFileToServer(req, res) {
    try {
        const { files } = req;

        if (!files) throw ({ status: 400, message: "Debe enviar un archivo" });

        const { image } = files;
        
        if (!image || !isImage(image.name)) {
            throw ({
                status: 400,
                message: "Sólo se permiten subir imágenes"
            });
        };

        // Guardar nombre de la imagen en la BD
        await Image.create({
           url: image.name,
           provider_id: 1 // Registramos que es local
        });

        image.mv(path.resolve(IMAGE_PATH), (err) => {
            if (err) {
                console.error(err);
                throw ({
                    status: 500,
                message: "Error al subir el archivo"
                });
        });

    } catch (error) {
        res
         .status(error.status || 500)
         .send({
            message: error.message || "Error del servidor"
         });
    } 
}

async function uploadFileToCloud(req, res) {
    try {
        const { files } = req;

        if (!files) throw ({ status: 400, message: "Debe enviar un archivo" });

        const { image } = files;
        
        if (!image || !isImage(image.name)) {
            throw ({
                status: 400,
                message: "Sólo se permiten subir imágenes"
            });
        }; 



    } catch (error) {
        res
         .status(error.status || 500)
         .send({
            message: error.message || "Error del servidor"
         });
    } 





}



module.exports = {
    renderForm,
    uploadFileToCloud,
    uploadFileToServer
}