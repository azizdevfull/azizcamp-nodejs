const express = require('express');
const router = express.Router();
const multer = require('multer');
const Attachment = require('../models/Attachment');
const Project = require('../models/Project');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

const index = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('attachments');
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.render('attachments/index', { project, attachments: project.attachments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const download = async (req, res) => {
    try {
      const attachment = await Attachment.findById(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }
  
      res.download(attachment.path, attachment.filename);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const destroy = async (req, res) => {
    try {
      const attachment = await Attachment.findById(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }
  
      // Remove file from disk
      fs.unlinkSync(attachment.path);
  
      // Remove attachment from database
      await Attachment.findByIdAndRemove(req.params.id);
  
      // Remove attachment reference from project
      const project = await Project.findById(attachment.project);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      project.attachments.pull(attachment._id);
      await project.save();
  
      res.redirect(`/projects/${project._id}/attachments`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const create =  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const attachment = new Attachment({
        filename: req.file.originalname,
        path: req.file.path,
        project: project._id
      });
  
      await attachment.save();
  
      project.attachments.push(attachment._id);
      await project.save();
  
      res.redirect(`/projects/${project._id}/attachments`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const newAttachment = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.render('attachments/new', { project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  module.exports = { index, download, destroy, create, newAttachment };