const express = require('express');
const router = express.Router();

const { create, destroy } = require('../controllers/messages.controller');

// Route to handle the submission of a new message
router.post('/projects/:projectId/message-boards/:messageBoardId/messages',create);

// Route to handle deleting a message
router.delete('/projects/:projectId/message-boards/:messageBoardId/messages/:messageId', destroy);


module.exports = router;
