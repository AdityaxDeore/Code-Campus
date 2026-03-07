const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// GET /api/assignments - Get all active assignments
router.get('/', async (req, res) => {
  try {
    const { status = 'active', teacherId, subject } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (teacherId) filter.teacherId = teacherId;
    if (subject && subject !== 'all') filter.subject = subject;
    
    const assignments = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/assignments/:id - Get a single assignment
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    
    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/assignments - Create a new assignment (teacher)
router.post('/', async (req, res) => {
  try {
    const {
      title, course, subject, instructions, assignmentType,
      allowedLanguages, starterCode, deadline, aiPolicy,
      examMode, rubric, maxMarks, difficulty,
      teacherId, teacherName
    } = req.body;
    
    if (!title || !instructions || !deadline || !teacherId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, instructions, deadline, teacherId'
      });
    }
    
    const assignment = new Assignment({
      title, course, subject, instructions, assignmentType,
      allowedLanguages: allowedLanguages || ['python'],
      starterCode, deadline: new Date(deadline), aiPolicy,
      examMode, rubric, maxMarks, difficulty,
      teacherId, teacherName,
      status: 'active'
    });
    
    await assignment.save();
    
    res.status(201).json({ success: true, id: assignment._id, assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/assignments/:id - Update an assignment (teacher)
router.put('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    
    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/assignments/:id - Archive an assignment (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Assignment archived' });
  } catch (error) {
    console.error('Error archiving assignment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
