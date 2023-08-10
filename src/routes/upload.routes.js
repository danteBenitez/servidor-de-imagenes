const { Router } = require('express');

const router = Router();
const {
    renderForm, 
    uploadFileToCloud,
    uploadFileToServer
} = require('../controllers/upload.controllers.js');


router.get('/', renderForm);

// Rutas de API
router.get('/api/images/local', uploadFileToServer);
router.get('/api/images/cloudinary', uploadFileToCloud);
router.get('/api/')

module.exports = router;