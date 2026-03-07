const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// GET /api/submissions?assignmentId=xxx - Get submissions for an assignment (teacher)
router.get('/', async (req, res) => {
  try {
    const { assignmentId, studentId } = req.query;
    
    const filter = {};
    if (assignmentId) filter.assignmentId = assignmentId;
    if (studentId) filter.studentId = studentId;
    
    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/submissions/:assignmentId/:studentId - Get a student's submission
router.get('/:assignmentId/:studentId', async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assignmentId: req.params.assignmentId,
      studentId: req.params.studentId
    }).lean();
    
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }
    
    res.json({ success: true, submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/submissions - Submit an assignment (student)
router.post('/', async (req, res) => {
  try {
    const { assignmentId, studentId, studentName, studentEmail, code, language, files, integrityData } = req.body;
    
    if (!assignmentId || !studentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assignmentId, studentId'
      });
    }
    
    // Upsert: update if exists, create if not
    const submission = await Submission.findOneAndUpdate(
      { assignmentId, studentId },
      {
        assignmentId,
        studentId,
        studentName,
        studentEmail,
        code,
        language,
        files,
        integrityData,
        status: 'submitted',
        submittedAt: new Date()
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.status(201).json({ success: true, submission });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/submissions/:id/grade - Grade a submission (teacher)
router.put('/:id/grade', async (req, res) => {
  try {
    const { score, feedback, gradedBy } = req.body;
    
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        score,
        feedback,
        gradedBy,
        gradedAt: new Date(),
        status: 'graded'
      },
      { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }
    
    res.json({ success: true, submission });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
