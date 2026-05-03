const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const Attachment = require('../models/Attachment');
const Project = require('../models/Project');
const fs = require('fs');
const { index, download, destroy, create, newAttachment } = require('../controllers/attachment.controller');
const upload = multer({ dest: 'uploads/' });
const attachmentCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/projects/:id/attachments/new', newAttachment);

router.post('/projects/:id/attachments', attachmentCreateLimiter, upload.single('file'), create);

router.get('/projects/:id/attachments', index);

router.get('/projects/:id/attachments/:id/download',download);

router.delete('/projects/:id/attachments/:id', destroy);


module.exports = router;
