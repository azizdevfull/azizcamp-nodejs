const express = require('express');
const router = express.Router();
const MessageBoard = require('../models/MessageBoard');
const Project = require('../models/Project');
const Message = require('../models/Message');
const { index, newMessageBoard, create, show, destroy, edit, update } = require('../controllers/message_board.controller');

// Route to display all message boards
router.get('/projects/:id/message-boards',index);

// Route to display the message board creation form
router.get('/projects/:id/message-boards/new',newMessageBoard);

// Route to handle the message board creation form submission
router.post('/projects/:id/message-boards', create);

// Route to display a specific message board
router.get('/projects/:projectId/message-boards/:messageBoardId', show);

// Route to delete a specific message from a message board
router.delete('/projects/:projectId/message-boards/:messageBoardId', destroy);

// Route to display the message board update form
router.get('/projects/:projectId/message-boards/:messageBoardId/edit', edit);

// Route to handle the message board update form submission
router.put('/projects/:projectId/message-boards/:messageBoardId', update);



module.exports = router;
