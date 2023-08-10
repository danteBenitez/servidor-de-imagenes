const { Router } = require('express');

const router = Router();
const {
    renderForm, 
    uploadFileToCloud,
    uploadFileToServer
} = require('../controllers/upload.controllers.js');


router.get('/', renderForm);

// Rutas de API
router.post('/api/images/local', uploadFileToServer);
router.post('/api/images/cloudinary', uploadFileToCloud);
router.post('/api/')

module.exports = router;