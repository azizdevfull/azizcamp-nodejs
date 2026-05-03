const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { index, create, destroy } = require('../controllers/task.controller');

const tasksLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

// Route to display all message boards
router.get('/projects/:id/tasks', tasksLimiter, index);

// Route to handle the message board creation form submission
router.post('/projects/:id/tasks', tasksLimiter, create);


router.delete('/projects/:projectId/tasks/:taskId', tasksLimiter, destroy);



module.exports = router;
