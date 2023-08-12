const { Router } = require('express');

const router = Router();
const {
    renderLocalGallery,
    renderFormLocal, 
    uploadFileToCloud,
    uploadFileToServer,
    renderFormCloud,
    getAllImagesFromProvider,
    renderCloudGallery,
    deleteFile,
    updateLocalFile,
    renderUpdateFormLocal,
    renderUpdateFormCloud,
    updateCloudFile,
} = require('../controllers/upload.controllers.js');

// Vistas
router.get(['/', '/local'], renderLocalGallery);
router.get('/cloudinary', renderCloudGallery);
router.get(['/', '/upload/local'], renderFormLocal);
router.get('/upload/cloudinary', renderFormCloud);
router.get('/update-local/:id', renderUpdateFormLocal);
router.get('/update-cloudinary/:id', renderUpdateFormCloud)

// Rutas de API
router.get('/api/images/providers/:provider_id', getAllImagesFromProvider);
router.post('/api/images/local', uploadFileToServer);
router.post('/api/images/cloudinary', uploadFileToCloud);
router.delete('/api/images/:id', deleteFile);
router.put('/api/images/local/:id', updateLocalFile);
router.put('/api/images/cloudinary/:id', updateCloudFile);

module.exports = router;