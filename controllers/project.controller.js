const router = require("express").Router();
const User = require("../models/User");
const Project = require("../models/Project");
// const auth = require("../rotes");


const newProject = async (req, res) => {
    res.render("projects/new");
  }

const create = async (req, res) => {
    req.body.user = req.session.user.id;
    await Project.create(req.body);
    res.redirect("/projects/");
  }

  const show = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findOne({ _id: id, user: req.session.user.id });
    console.log(project)
    if (project) {
      res.render("projects/show", {
          project,
      });
    } else {
      res.status(400).json({ error: "No Project of This ID for this user" });
    }
  }

  const edit = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findOne({ _id: id, user: req.session.user.id });
    console.log(project)
    if (project) {
      res.render("projects/edit", {
          project,
      });
    } else {
      res.status(400).json({ error: "No Project of This ID for this user" });
    }
  } 

  const update = async (req, res) => {
    const allowedFields = ["name", "description", "status", "deadline"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { $set: updates }
    );
    res.redirect("/projects");
  }

  const destroy = async (req, res) => {
    await Project.findByIdAndRemove(req.params.id);
    res.redirect("/projects");
  }



  module.exports = { create, show, edit, update,newProject, destroy };