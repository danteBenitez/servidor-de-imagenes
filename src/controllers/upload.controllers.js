const fs = require("fs/promises");
const path = require("path");
const Image = require("../models/image.js");
const isImage = require("../utils/isImage.js");

// Directorio en el que guardar las imágenes subidas localmente
const IMAGE_PATH = "./images/";

function renderForm(_req, res) {
  res.render("upload-local");
}

async function uploadFileToServer(req, res) {
  try {
    const { files } = req;

    if (!files) throw { status: 400, message: "Debe enviar un archivo" };

    const { image } = files;

    if (!image || !isImage(image.name)) {
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

      res.send(200, { message: "Archivo guardado exitosamente" });
    });
  } catch (error) {
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

    await image.destroy();

    fs.rm()

  } catch(err) {

  }


}


async function uploadFileToCloud(req, res) {
  try {
    const { files } = req;

    if (!files) throw { status: 400, message: "Debe enviar un archivo" };

    const { image } = files;

    if (!image || !isImage(image.name)) {
      throw {
        status: 400,
        message: "Sólo se permiten subir imágenes",
      };
    }
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Error del servidor",
    });
  }
}

module.exports = {
  renderForm,
  uploadFileToCloud,
  uploadFileToServer,
};
