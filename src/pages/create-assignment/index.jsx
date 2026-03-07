import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { createAssignment } from '../../lib/assignmentService';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    subject: 'dsa',
    instructions: '',
    assignmentType: 'code',
    allowedLanguages: ['python'],
    starterCode: '',
    deadline: '',
    aiPolicy: 'enabled',
    examMode: false,
    rubric: '',
    maxMarks: 100,
    difficulty: 'Medium'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const languages = prev.allowedLanguages.includes(lang)
        ? prev.allowedLanguages.filter(l => l !== lang)
        : [...prev.allowedLanguages, lang];
      return { ...prev, allowedLanguages: languages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Please provide an assignment title');
      return;
    }
    
    if (!formData.instructions.trim()) {
      setError('Please provide assignment instructions');
      return;
    }
    
    if (!formData.deadline) {
      setError('Please set a deadline');
      return;
    }
    
    if (formData.allowedLanguages.length === 0) {
      setError('Please select at least one programming language');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createAssignment(formData, user.uid);
      
      if (result.success) {
        alert('✅ Assignment created successfully!');
        navigate('/assignments');
      } else {
        setError('Failed to create assignment: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while creating the assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Assignment - CodeCampus</title>
        <meta name="description" content="Create a new assignment for your students" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="ml-2">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
            <p className="text-gray-600 mt-2">Set up a new assignment for your students</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon name="FileText" size={20} className="mr-2" />
                Basic Information
              </h2>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Binary Search Tree - Insert & Delete"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="e.g., CS201"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="dsa">DSA</option>
                    <option value="oops">OOPS</option>
                    <option value="datascience">Data Science</option>
                    <option value="dbms">DBMS</option>
                    <option value="webdev">Web Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Instructions *
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Provide detailed instructions for the assignment..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  required
                />
              </div>
            </div>

            {/* Assignment Configuration */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon name="Settings" size={20} className="mr-2" />
                Configuration
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="assignmentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    id="assignmentType"
                    name="assignmentType"
                    value={formData.assignmentType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="code">Code Editor</option>
                    <option value="document">Document Upload</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Marks
                  </label>
                  <Input
                    id="maxMarks"
                    name="maxMarks"
                    type="number"
                    value={formData.maxMarks}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Languages *
                </label>
                <div className="flex flex-wrap gap-2">
                  {['python', 'javascript', 'java', 'cpp', 'sql'].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        formData.allowedLanguages.includes(lang)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="starterCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Starter Code (Optional)
                </label>
                <textarea
                  id="starterCode"
                  name="starterCode"
                  value={formData.starterCode}
                  onChange={handleInputChange}
                  placeholder="# Write your starter code here&#10;def solve():&#10;    # TODO: Implement this function&#10;    pass"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                />
              </div>
            </div>

            {/* Deadline and Policies */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon name="Clock" size={20} className="mr-2" />
                Deadline & Policies
              </h2>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="aiPolicy" className="block text-sm font-medium text-gray-700 mb-2">
                  AI Assistant Policy
                </label>
                <select
                  id="aiPolicy"
                  name="aiPolicy"
                  value={formData.aiPolicy}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="enabled">Enabled</option>
                  <option value="limited">Limited (hints only)</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="examMode"
                  name="examMode"
                  checked={formData.examMode}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="examMode" className="text-sm font-medium text-gray-700 flex items-center">
                  <Icon name="ShieldAlert" size={16} className="mr-1.5 text-amber-600" />
                  Enable Exam Mode (blocks paste, tracks copy attempts)
                </label>
              </div>

              <div>
                <label htmlFor="rubric" className="block text-sm font-medium text-gray-700 mb-2">
                  Grading Rubric (Optional)
                </label>
                <textarea
                  id="rubric"
                  name="rubric"
                  value={formData.rubric}
                  onChange={handleInputChange}
                  placeholder="Describe how you will grade this assignment..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Create Assignment
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAssignment;
