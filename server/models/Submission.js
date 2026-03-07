const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    default: ''
  },
  studentEmail: {
    type: String,
    default: ''
  },
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'python'
  },
  files: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned'],
    default: 'submitted'
  },
  score: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  gradedAt: {
    type: Date,
    default: null
  },
  gradedBy: {
    type: String,
    default: null
  },
  integrityData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound index: one submission per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
