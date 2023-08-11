const fs = require("fs/promises");
const path = require("path");
const Image = require("../models/image.js");
const isImage = require("../utils/isImage.js");
const {
  uploadToCloud,
  deleteFileFromCloud,
} = require("../utils/cloudinary.js");
const { PAGES } = require("../utils/constants.js");
const { all } = require("../routes/upload.routes.js");

// Directorio en el que guardar las imágenes subidas localmente
const IMAGE_PATH = "./public/uploads/";

// Vistas
function renderLocalGallery(_req, res) {
  res.render("gallery.ejs", {
    pages: PAGES,
    active: "gallery",
    provider: "Servidores propios",
    provider_id: 1,
  });
}

function renderCloudGallery(_req, res) {
  res.render("gallery.ejs", {
    pages: PAGES,
    active: "gallery",
    provider: "Cloudinary",
    provider_id: 2,
  });
}

function renderFormLocal(_req, res) {
  res.render("upload-local", {
    pages: PAGES,
    active: "local",
  });
}

function renderFormCloud(_req, res) {
  res.render("upload-cloud", {
    pages: PAGES,
    active: "cloudinary",
  });
}

function renderUpdateFormLocal(req, res) {
  res.render("update-local", {
    pages: PAGES,
    active: "local",
    id: req.params.id,
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

        res.status(200).send({ message: "Archivo guardado exitosamente" });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      message: error.message || "Error interno del servidor",
    });
  }
}

async function deleteFile(req, res) {
  const { id } = req.params;

  try {
    const image = await Image.findByPk(id);
    console.log("Image to delete ", image);
    if (!image) throw { status: 400, message: "La imagen a borrar no existe" };

    if (image.provider_id == 1) {
      await fs.rm(path.join(IMAGE_PATH, image.name));

      await image.destroy();
    } else if (image.provider_id == 2) {
      const { id } = image;

      await deleteFileFromCloud(id);
      await image.destroy();
    }

    res.status(200).send({
      message: "Archivo eliminado exitosamente",
    });
  } catch (err) {
    res.status(err.status || 500).send({
      message: err.message || "Error interno del servidor",
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

      // Creamos la imagen solamente para acceder a la última id
      const createdImage = await Image.create({
        url: "",
        provider_id: 2, // indicar que proviene de cloudinary
      });

      const { id: publicId } = createdImage;

      // Actualizamos la URL luego de obtenerla de Cloudinary
      const uploadedImage = await uploadToCloud(image, publicId);
      await createdImage.update({
        url: uploadedImage.url,
      });

      toSend.push({
        image: image.name,
        url: createdImage.url,
      });
    }

    res.status(200).send({
      uploaded: toSend,
      message: "Archivo/s subidos correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      message: error.message || "Error del servidor",
    });
  }
}

async function getAllImagesFromProvider(req, res) {
  const { provider_id } = req.params;

  try {
    let allImages = await Image.findAll({
      where: {
        provider_id,
      },
    });

    if (allImages.length == 0) {
      throw {
        status: 404,
        message: "No hay imágenes disponibles",
      };
    }
    // Añadimos el prefijo correcto en caso de ser un archivo local
    if (provider_id == 1) {
      allImages = allImages.map(({ id, url }) => ({
        url: path.join("/uploads", url),
        id,
      }));
    } else {
      // Sino, simplemente filtramos los datos a enviar
      allImages = allImages.map(({ id, url }) => ({ id, url }));
    }

    res.status(200).send({
      images: allImages,
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send({
      message: err.message || "Error interno del servidor",
    });
  }
}

async function updateLocalFile(req, res) {
  const id = req.params.id;
  console.log("Buscando imagen de ID: ", id);
  try {
    const { files } = req;

    if (!files || Object.keys(files).length > 1) {
      throw {
        status: 400,
        message: "Sólo es posible actualizar un archivo a la vez",
      };
    }
    const image = Object.values(files)[0];

    if (!image || !isImage(image.mimetype)) {
      throw {
        status: 400,
        message: "Sólo se permiten subir imágenes",
      };
    }

    const oldImage = await Image.findByPk(id);
    if (!oldImage) {
      throw new Error("Imagen no encontrada");
    }

    await fs.rm(path.join(IMAGE_PATH, oldImage.url));

    image.mv(path.join(IMAGE_PATH, image.name), async (err) => {
      if (err) {
        console.error(err);
        throw {
          status: 500,
          message: "Error al subir el archivo",
        };
      }
      // Guardar nombre de la imagen en la BD
      await oldImage.update({
        url: image.name,
        providerId: 1, // Registramos que es local
      });

      res.status(200).send({ message: "Archivo guardado exitosamente" });
    });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .send({ message: error.message || "Error interno del servidor" });
  }
}

module.exports = {
  updateLocalFile,
  renderLocalGallery,
  renderCloudGallery,
  renderFormLocal,
  renderFormCloud,
  renderUpdateFormLocal,
  renderFormLocal,
  uploadFileToCloud,
  uploadFileToServer,
  getAllImagesFromProvider,
  deleteFile,
};
