const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  dueDate: {
    type: Date
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

taskSchema.pre('save', async function(next) {
  if (this.isModified('status')) {
    if (this.status === 'Done') {
      this.completedAt = new Date();
    } else {
      this.completedAt = undefined;
    }
    
    const Project = mongoose.model('Project');
    const project = await Project.findById(this.project);
    if (project) {
      await project.updateProgress();
    }
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema); 