const Image = require('../models/Image.js');
const isImage = require('../utils/isImage.js');

// Directorio en el que guardar las imágenes subidas localmente
const IMAGE_PATH = '../images';



function renderForm(_req, res) {
    res.render('index');
}

function uploadFileToCloud(req, res) {
    try {
        const { files } = req;

        if (!files) throw ({ message: "Debe enviar un archivo" });

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

}

function uploadFileToServer(req, res) {}



module.exports = {
    renderForm,
    uploadFileToCloud,
    uploadFileToServer
}