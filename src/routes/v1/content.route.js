const express = require('express');
const { contentController } = require('../../controllers');

const router = express.Router();

router.get('/', contentController.getContentResolutions);
router.get('/download', contentController.downloadContent);

module.exports = router;
