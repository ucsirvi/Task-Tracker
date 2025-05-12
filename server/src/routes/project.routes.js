const express = require('express');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();


router.post('/', auth, async (req, res) => {
  try {
    const projectCount = await Project.countDocuments({ owner: req.user._id });
    if (projectCount >= 4) {
      return res.status(400).json({ message: 'Maximum project limit (4) reached' });
    }

    const { title, description } = req.body;
    const project = new Project({
      title,
      description,
      owner: req.user._id
    });

    await project.save();
    req.user.projectCount += 1;
    await req.user.save();

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('tasks')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('tasks')
      .populate('owner', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'progress'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    updates.forEach(update => project[update] = req.body[update]);
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: project._id });

    req.user.projectCount -= 1;
    await req.user.save();

    res.json(project);
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 