const { generateSummarizedFile } = require('../controllers/controllers')

const express = require('express');

const fileRouter = express.Router();


fileRouter.post('/', generateSummarizedFile);


module.exports = { fileRouter };