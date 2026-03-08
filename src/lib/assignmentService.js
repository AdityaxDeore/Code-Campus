// In-memory assignment store (mock — no backend needed)
let localAssignments = [];

/**
 * Teacher: Create Assignment (stores locally in memory)
 */
export const createAssignment = async (assignmentData, teacherId, teacherName = '') => {
  const assignment = {
    _id: 'local_' + Date.now(),
    ...assignmentData,
    teacherId,
    teacherName,
    createdAt: new Date().toISOString(),
  };
  localAssignments.push(assignment);
  return { success: true, id: assignment._id, assignment };
};

/**
 * Get all active assignments (returns local store)
 */
export const getAssignments = async (filters = {}) => {
  let results = [...localAssignments];
  if (filters.subject && filters.subject !== 'all') {
    results = results.filter(a => a.subject === filters.subject);
  }
  return { success: true, assignments: results };
};
