const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['dsa', 'oops', 'datascience', 'dbms', 'webdev', 'os', 'cn', 'ai_ml', 'cyber_security', 'software_engineering', 'other'],
    default: 'dsa'
  },
  instructions: {
    type: String,
    required: true
  },
  assignmentType: {
    type: String,
    enum: ['code', 'document', 'hybrid'],
    default: 'code'
  },
  allowedLanguages: [{
    type: String,
    enum: ['python', 'javascript', 'java', 'cpp', 'sql', 'html']
  }],
  starterCode: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    required: true
  },
  aiPolicy: {
    type: String,
    enum: ['enabled', 'limited', 'disabled'],
    default: 'enabled'
  },
  examMode: {
    type: Boolean,
    default: false
  },
  rubric: {
    type: String,
    default: ''
  },
  maxMarks: {
    type: Number,
    default: 100,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  teacherId: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Index for querying active assignments
assignmentSchema.index({ status: 1, createdAt: -1 });
assignmentSchema.index({ teacherId: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
