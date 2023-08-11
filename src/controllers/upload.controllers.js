const fs = require("fs/promises");
const path = require("path");
const Image = require("../models/image.js");
const isImage = require("../utils/isImage.js");
const { upload } = require("../utils/cloudinary.js");
const PAGES = require('../utils/constants.js');

// Directorio en el que guardar las imágenes subidas localmente
const IMAGE_PATH = "./images/";

// Vistas
function renderFormLocal(_req, res) {
  res.render("upload-local", {
    pages: PAGES,
    active: 'Subir'
  });
}

function renderFormCloud(_req, res) {
    res.render('upload-cloud', {
      pages: PAGES,
      active: "Subir con Cloudinary"
    });
}

async function uploadFileToServer(req, res) {
  try {
    const { files } = req;

    if (!files) throw { status: 400, message: "Debe enviar un archivo" };
    
    for (const image of Object.values(files)) {

      if (!image || !isImage(image.mimetype)) {
        throw {
          status: 400,
          message: "Sólo se permiten subir imágenes",
        };
      }
  
      image.mv(path.join(IMAGE_PATH, image.name), async (err) => {
        if (err) {
          console.error(err);
          throw {
            status: 500,
            message: "Error al subir el archivo",
          };
        }
        // Guardar nombre de la imagen en la BD
        await Image.create({
          url: image.name,
          providerId: 1, // Registramos que es local
        });
  
        res
        .status(200)
        .send({ message: "Archivo guardado exitosamente" });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      message: error.message || "Error interno del servidor",
    });
  }
}

async function deleteLocalFile(req, res) {
  const { id } = req;

  try {
    const image = await Image.findByPk(id);

    if (!image) throw ({ status: 400, message: "La imagen a borrar no existe" });

    await fs.rm(path.join(IMAGE_PATH, image.name))

    await image.destroy();

  } catch(err) {
    res.status(err.status || 500).send({
      message: err.message || "Error interno del servidor"
    });
  }


}


async function uploadFileToCloud(req, res) {
  try {
    const { files } = req;

    if (!files) throw { status: 400, message: "Debe enviar un archivo" };

    let toSend = [];
    for (const image of Object.values(files)) {
        if (!image || !isImage(image.mimetype)) {
          throw {
            status: 400,
            message: "Sólo se permiten subir imágenes",
          };
        }

        const uploadedImage = await upload(image);

        toSend.push({
          image: image.name,
          url: uploadedImage.url
        });

        await Image.create({
          url: uploadedImage.url,
          providerId: 2 // Indicar que proviene de Cloudinary
        });
    }

    res
     .status(200)
     .send({
        uploaded: toSend, 
        message: "Archivo/s subidos correctamente",
    });

  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Error del servidor",
    });
  }
}

module.exports = {
  renderFormLocal,
  renderFormCloud,
  uploadFileToCloud,
  uploadFileToServer,
};
