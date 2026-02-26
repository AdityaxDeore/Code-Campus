import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

/**
 * Teacher: Create Assignment
 */
export const createAssignment = async (assignmentData, teacherId, teacherName = '') => {
  try {
    const { data } = await api.post('/assignments', {
      ...assignmentData,
      teacherId,
      teacherName
    });
    return data; // { success, id, assignment }
  } catch (error) {
    console.error('Error creating assignment:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Get all active assignments
 */
export const getAssignments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.teacherId) params.set('teacherId', filters.teacherId);
    if (filters.subject && filters.subject !== 'all') params.set('subject', filters.subject);

    const { data } = await api.get(`/assignments?${params.toString()}`);
    return data; // { success, assignments }
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return { success: false, error: error.response?.data?.error || error.message, assignments: [] };
  }
};

/**
 * Get a single assignment by ID
 */
export const getAssignment = async (assignmentId) => {
  try {
    const { data } = await api.get(`/assignments/${assignmentId}`);
    return data; // { success, assignment }
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Teacher: Update Assignment
 */
export const updateAssignment = async (assignmentId, updates) => {
  try {
    const { data } = await api.put(`/assignments/${assignmentId}`, updates);
    return data; // { success, assignment }
  } catch (error) {
    console.error('Error updating assignment:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Teacher: Archive (soft-delete) Assignment
 */
export const deleteAssignment = async (assignmentId) => {
  try {
    const { data } = await api.delete(`/assignments/${assignmentId}`);
    return data; // { success, message }
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Student: Submit Assignment
 */
export const submitAssignment = async (assignmentId, studentId, submissionData) => {
  try {
    const { data } = await api.post('/submissions', {
      assignmentId,
      studentId,
      ...submissionData
    });
    return data; // { success, submission }
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Get a student's submission for an assignment
 */
export const getSubmission = async (assignmentId, studentId) => {
  try {
    const { data } = await api.get(`/submissions/${assignmentId}/${studentId}`);
    return data; // { success, submission }
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, error: 'Not submitted yet' };
    }
    console.error('Error fetching submission:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Teacher: Get all submissions for an assignment
 */
export const getSubmissions = async (assignmentId) => {
  try {
    const { data } = await api.get(`/submissions?assignmentId=${assignmentId}`);
    return data; // { success, submissions }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: error.response?.data?.error || error.message, submissions: [] };
  }
};

/**
 * Teacher: Grade a submission
 */
export const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const { data } = await api.put(`/submissions/${submissionId}/grade`, gradeData);
    return data; // { success, submission }
  } catch (error) {
    console.error('Error grading submission:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Health check for the API
 */
export const checkApiHealth = async () => {
  try {
    const { data } = await api.get('/health');
    return data;
  } catch {
    return { status: 'error', mongo: 'disconnected' };
  }
};
