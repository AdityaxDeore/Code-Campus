const ASSIGNMENTS_STORAGE_KEY = 'codecampus_assignments_v1';

const seedAssignments = [
  {
    _id: 'seed_a1',
    title: 'BST Insert and Delete',
    course: 'CS201',
    subject: 'dsa',
    instructions: 'Implement insert, delete, search, and traversals.',
    assignmentType: 'code',
    allowedLanguages: ['cpp', 'java', 'python'],
    starterCode: '',
    deadline: '2026-04-08T23:59:00',
    aiPolicy: 'limited',
    examMode: true,
    rubric: '',
    maxMarks: 100,
    difficulty: 'Medium',
    status: 'published',
    teacherId: 'seed_teacher',
    teacherName: 'Teacher',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_a2',
    title: 'Graph Traversal BFS DFS',
    course: 'CS201',
    subject: 'dsa',
    instructions: 'Solve traversal tasks using BFS and DFS.',
    assignmentType: 'code',
    allowedLanguages: ['cpp', 'java', 'python'],
    starterCode: '',
    deadline: '2026-04-12T23:59:00',
    aiPolicy: 'limited',
    examMode: false,
    rubric: '',
    maxMarks: 100,
    difficulty: 'Medium',
    status: 'published',
    teacherId: 'seed_teacher',
    teacherName: 'Teacher',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_a3',
    title: 'SQL Joins and Subqueries',
    course: 'CS202',
    subject: 'dbms',
    instructions: 'Practice relational joins and nested queries.',
    assignmentType: 'code',
    allowedLanguages: ['sql'],
    starterCode: '',
    deadline: '2026-04-15T23:59:00',
    aiPolicy: 'enabled',
    examMode: false,
    rubric: '',
    maxMarks: 100,
    difficulty: 'Medium',
    status: 'draft',
    teacherId: 'seed_teacher',
    teacherName: 'Teacher',
    createdAt: new Date().toISOString(),
  },
];

const loadAssignments = () => {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(seedAssignments));
      return [...seedAssignments];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...seedAssignments];
  } catch {
    return [...seedAssignments];
  }
};

const saveAssignments = (assignments) => {
  localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
};

/**
 * Teacher: Create Assignment (stores locally in memory)
 */
export const createAssignment = async (assignmentData, teacherId, teacherName = '') => {
  const localAssignments = loadAssignments();
  const assignment = {
    _id: 'local_' + Date.now(),
    ...assignmentData,
    teacherId,
    teacherName,
    createdAt: new Date().toISOString(),
  };
  localAssignments.push(assignment);
  saveAssignments(localAssignments);
  return { success: true, id: assignment._id, assignment };
};

/**
 * Get all active assignments (returns local store)
 */
export const getAssignments = async (filters = {}) => {
  let results = loadAssignments();

  if (filters.subject && filters.subject !== 'all') {
    results = results.filter(a => a.subject === filters.subject);
  }

  if (filters.status && filters.status !== 'all') {
    results = results.filter(a => a.status === filters.status);
  }

  if (filters.teacherId) {
    results = results.filter(a => a.teacherId === filters.teacherId);
  }

  return { success: true, assignments: results };
};

export const updateAssignmentStatus = async (assignmentId, status) => {
  const assignments = loadAssignments();
  const next = assignments.map((assignment) => {
    if (assignment._id !== assignmentId) return assignment;
    return {
      ...assignment,
      status,
      updatedAt: new Date().toISOString(),
    };
  });
  saveAssignments(next);
  return { success: true };
};
