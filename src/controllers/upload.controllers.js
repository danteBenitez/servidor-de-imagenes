const Image = require('../models/Image.js');

function renderForm(_req, res) {
    res.render('index');
}

function uploadFileToCloud(req, res) {}

function uploadFileToServer(req, res) {}

module.exports = {
    renderForm,
    uploadFileToCloud,
    uploadFileToServer
}