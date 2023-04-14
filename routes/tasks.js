const express = require('express');
const router = express.Router();
const MessageBoard = require('../models/MessageBoard');
const Project = require('../models/Project');
const Message = require('../models/Message');
const Task = require('../models/Task');
// Route to display all message boards
router.get('/projects/:id/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks');
    res.render('tasks/index', { project, tasks: project.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle the message board creation form submission
router.post('/projects/:id/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      name: req.body.name,
      project: project._id
    });

    await task.save();

    project.tasks.push(task._id);
    await project.save();

    res.redirect(`/projects/${project._id}/tasks`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/projects/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndRemove(task._id);
    project.tasks.pull(task._id);
    await project.save();

    res.redirect(`/projects/${project._id}/tasks`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
