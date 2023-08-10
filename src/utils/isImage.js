// Utilidad que retorna un booleano indicando si un archivo es una imagen
// El tipo MIME de una imagen siempre comienza `image/`, p. ej. `image/jpeg`
function isImage(mimeType) {
    return mimeType.startsWith('image');
}

module.exports = isImage;