const MessageBoard = require('../models/MessageBoard');
const Message = require('../models/Message');
const Project = require('../models/Project');

const create =  async (req, res) => {
    try {
      const { projectId, messageBoardId } = req.params;
      const { text } = req.body;
  
      // Check if project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).send('Project not found');
      }
  
      // Check if message board exists in the project
      const messageBoard = await MessageBoard.findOne({ _id: messageBoardId, project: projectId });
      if (!messageBoard) {
        return res.status(404).send('Message board not found');
      }
  
      // Create new message
      const message = new Message({ text, messageBoard, author: req.session.user.username });
      await message.save();
  
      // Add the message to the message board
      messageBoard.messages.push(message);
      await messageBoard.save();
  
      res.redirect(`/projects/${projectId}/message-boards/${messageBoardId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }

  const destroy =  async (req, res) => {
    try {
      const { projectId, messageBoardId, messageId } = req.params;
  
      // Check if project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).send('Project not found');
      }
  
      // Check if message board exists in the project
      const messageBoard = await MessageBoard.findOne({ _id: messageBoardId, project: projectId });
      if (!messageBoard) {
        return res.status(404).send('Message board not found');
      }
  
      // Check if message exists in the message board
      const message = await Message.findOne({ _id: messageId, messageBoard: messageBoardId });
      if (!message) {
        return res.status(404).send('Message not found');
      }
  
      // Delete the message
      await Message.findByIdAndRemove(message._id);
  
      // Remove the message from the message board
      messageBoard.messages = messageBoard.messages.filter(msg => msg.toString() !== messageId);
      await messageBoard.save();
  
      res.redirect(`/projects/${projectId}/message-boards/${messageBoardId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }


module.exports = { create, destroy };