const MessageBoard = require('../models/MessageBoard');
const Project = require('../models/Project');
const Message = require('../models/Message');

const index =  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('messageBoards');
      res.render('message-boards/index', { project, messageBoards: project.messageBoards });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const show = async (req, res) => {
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
  }

  const newMessageBoard = async (req, res) => {
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
  }

  const create = async (req, res) => {
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
  }

  const destroy = async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const messageBoard = await MessageBoard.findById(req.params.messageBoardId);
      if (!messageBoard) {
        return res.status(404).json({ message: 'Message board not found' });
      }
  
      await Message.deleteMany({ messageBoard: messageBoard._id });
      await MessageBoard.findByIdAndRemove(messageBoard._id);
      project.messageBoards.pull(messageBoard._id);
      await project.save();
  
      res.redirect(`/projects/${project._id}/message-boards`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const edit = async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const messageBoard = await MessageBoard.findById(req.params.messageBoardId);
      if (!messageBoard) {
        return res.status(404).json({ message: 'Message board not found' });
      }
  
      res.render('message-boards/edit', { project, messageBoard });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const update = async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      let messageBoard = await MessageBoard.findById(req.params.messageBoardId);
      if (!messageBoard) {
        return res.status(404).json({ message: 'Message board not found' });
      }
  
      messageBoard.name = req.body.name;
      await messageBoard.save();
  
      res.redirect(`/projects/${project._id}/message-boards/${messageBoard._id}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

module.exports = { index,
    newMessageBoard,
    create,
    show,
    edit,
    update,
    destroy
 };