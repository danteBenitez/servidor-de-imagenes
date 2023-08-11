const { Router } = require('express');

const router = Router();
const {
    renderFormLocal, 
    uploadFileToCloud,
    uploadFileToServer,
    renderFormCloud
} = require('../controllers/upload.controllers.js');

// Vistas
router.get(['/', '/upload/local'], renderFormLocal);
router.get('/upload/cloudinary', renderFormCloud);

// Rutas de API
router.post('/api/images/local', uploadFileToServer);
router.post('/api/images/cloudinary', uploadFileToCloud);

module.exports = router;