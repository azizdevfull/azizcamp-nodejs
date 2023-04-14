const express = require('express');
const router = express.Router();
const MessageBoard = require('../models/MessageBoard');
const Project = require('../models/Project');
const Message = require('../models/Message');

// Route to display all message boards
router.get('/projects/:id/message-boards', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('messageBoards');
    res.render('message-boards/index', { project, messageBoards: project.messageBoards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to display the message board creation form
router.get('/projects/:id/message-boards/new', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.render('message-boards/new', { project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle the message board creation form submission
router.post('/projects/:id/message-boards', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const messageBoard = new MessageBoard({
      name: req.body.name,
      project: project._id
    });

    await messageBoard.save();

    project.messageBoards.push(messageBoard._id);
    await project.save();

    res.redirect(`/projects/${project._id}/message-boards`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to display a specific message board
router.get('/projects/:projectId/message-boards/:messageBoardId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const messageBoard = await MessageBoard.findById(req.params.messageBoardId);
    if (!messageBoard) {
      return res.status(404).json({ message: 'Message board not found' });
    }

    const messages = await Message.find({ messageBoard: messageBoard._id });

    res.render('message-boards/show', { project, messageBoard, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
