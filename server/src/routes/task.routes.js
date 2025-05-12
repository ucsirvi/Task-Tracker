const express = require('express');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      project: projectId,
      createdBy: req.user._id
    });

    await task.save();
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const match = { createdBy: req.user._id };
    const sort = {};

    if (req.query.project) {
      match.project = req.query.project;
    }

    if (req.query.status) {
      match.status = req.query.status;
    }

    if (req.query.priority) {
      match.priority = req.query.priority;
    }

    if (req.query.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (req.query.dueDate === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        match.dueDate = { $gte: today, $lt: tomorrow };
      } else if (req.query.dueDate === 'week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        match.dueDate = { $gte: today, $lt: nextWeek };
      }
    }

    if (req.query.search) {
      match.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const tasks = await Task.find(match)
      .sort(sort)
      .populate('project', 'title');

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate('project', 'title');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    if (updates.includes('status')) {
      const project = await Project.findById(task.project);
      if (project) {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: 'Done'
        });
        project.progress = Math.round((completedTasks / totalTasks) * 100);
        await project.save();
      }
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (project) {
      project.tasks = project.tasks.filter(t => t.toString() !== task._id.toString());
      
      const totalTasks = await Task.countDocuments({ project: project._id });
      const completedTasks = await Task.countDocuments({
        project: project._id,
        status: 'Done'
      });
      project.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      await project.save();
    }

    res.json(task);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 