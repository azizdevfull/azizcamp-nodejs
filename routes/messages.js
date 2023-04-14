const express = require('express');
const router = express.Router();
const MessageBoard = require('../models/MessageBoard');
const Message = require('../models/Message');

// Route to display a list of all messages
router.get('/message-boards/:messageBoardId/messages', async (req, res) => {
  try {
    const messageBoard = await MessageBoard.findById(req.params.messageBoardId).populate('messages');
    if (!messageBoard) {
      return res.status(404).json({ message: 'Message board not found' });
    }
    res.render('messages/index', { messageBoard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to display the form for creating a new message
router.get('/message-boards/:messageBoardId/messages/new', async (req, res) => {
  try {
    const messageBoard = await MessageBoard.findById(req.params.messageBoardId);
    if (!messageBoard) {
      return res.status(404).json({ message: 'Message board not found' });
    }
    res.render('messages/new', { messageBoard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle the submission of a new message
router.post('/message-boards/:messageBoardId/messages', async (req, res) => {
  try {
    const messageBoard = await MessageBoard.findById(req.params.messageBoardId);
    if (!messageBoard) {
      return res.status(404).json({ message: 'Message board not found' });
    }
    const message = new Message({
      text: req.body.text,
      messageBoard: messageBoard._id
    });
    await message.save();
    messageBoard.messages.push(message._id);
    await messageBoard.save();
    res.redirect(`/message-boards/${messageBoard._id}/messages`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle the deletion of a message
router.delete('/message-boards/:messageBoardId/messages/:messageId', async (req, res) => {
  try {
    const messageBoard = await MessageBoard.findById(req.params.messageBoardId);
    if (!messageBoard) {
      return res.status(404).json({ message: 'Message board not found' });
    }
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await message.remove();
    messageBoard.messages.pull(message._id);
    await messageBoard.save();
    res.redirect(`/message-boards/${messageBoard._id}/messages`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
