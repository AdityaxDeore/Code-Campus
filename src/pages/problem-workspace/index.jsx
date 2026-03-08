import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProblemPanel from './components/ProblemPanel';
import CodeEditor from './components/CodeEditor';
import TestResults from './components/TestResults';
import SubmissionHistory from './components/SubmissionHistory';
import CollaborativeMode from './components/CollaborativeMode';
import SuccessAnimation from './components/SuccessAnimation';
import integrityLogger, { INTEGRITY_EVENTS } from '../../lib/integrity';
import Icon from '../../components/AppIcon';

import Button from '../../components/ui/Button';

const ProblemWorkspace = () => {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('id');
  
  const [showHints, setShowHints] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [showSubmissionHistory, setShowSubmissionHistory] = useState(false);
  const [showCollaborativeMode, setShowCollaborativeMode] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showLearningAids, setShowLearningAids] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [pasteWarnings, setPasteWarnings] = useState([]);

  // Mock problems database
  const problemsDatabase = {
    1: {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      successRate: 87,
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
      constraints: [
        "2 ≤ nums.length ≤ 10⁴",
        "-10⁹ ≤ nums[i] ≤ 10⁹",
        "-10⁹ ≤ target ≤ 10⁹",
        "Only one valid answer exists."
      ],
      tags: ["Array", "Hash Table", "Two Pointers"],
      hints: [
        "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
        "Again, the best way to maintain a mapping of each element in the array to its index is a hash table.",
        "The best time complexity that we can achieve is O(n) where n is the number of elements in the array."
      ],
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        },
        {
          input: "nums = [3,3], target = 6",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
        }
      ],
      discussions: [
        {
          id: 1,
          author: "Alex Chen",
          content: "Has anyone tried using a hash map approach? I'm getting the right answer but wondering about the time complexity.",
          timestamp: "2 hours ago",
          likes: 12
        },
        {
          id: 2,
          author: "Sarah Kim",
          content: "The hash map approach is O(n) time and O(n) space. Much better than the brute force O(n²) solution!",
          timestamp: "1 hour ago",
          likes: 8
        },
        {
          id: 3,
          author: "Mike Rodriguez",
          content: "Don't forget to handle the edge case where the same element can't be used twice. Check the indices!",
          timestamp: "45 minutes ago",
          likes: 15
        }
      ]
    },
    2: {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      successRate: 67,
      description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
      constraints: [
        "The number of nodes in each linked list is in the range [1, 100]",
        "0 ≤ Node.val ≤ 9",
        "It is guaranteed that the list represents a number that does not have leading zeros"
      ],
      tags: ["LinkedList", "Math", "Recursion"],
      hints: [
        "Keep track of the carry while traversing both linked lists.",
        "Don't forget to handle the case where one list is longer than the other.",
        "After processing both lists, check if there's still a carry to add."
      ],
      examples: [
        {
          input: "l1 = [2,4,3], l2 = [5,6,4]",
          output: "[7,0,8]",
          explanation: "342 + 465 = 807"
        }
      ],
      discussions: []
    },
    101: {
      id: 101,
      title: "Fix the Array Sum Bug",
      difficulty: "Easy",
      successRate: 78,
      description: `The following function is supposed to calculate the sum of all elements in an array, but it contains a bug. Your task is to identify and fix the bug.\n\n\`\`\`javascript\nfunction arraySum(arr) {\n    let sum = 1; // Bug is here!\n    for (let i = 0; i < arr.length; i++) {\n        sum += arr[i];\n    }\n    return sum;\n}\n\`\`\`\n\nThe function should return 0 for an empty array and the correct sum for non-empty arrays.`,
      constraints: [
        "Array length can be 0 to 1000",
        "Array elements are integers between -1000 and 1000"
      ],
      tags: ["Logic Errors", "Array", "Debugging"],
      hints: [
        "Check the initial value of the sum variable.",
        "What should the sum be when starting the calculation?"
      ],
      examples: [
        {
          input: "arr = [1, 2, 3, 4, 5]",
          output: "15",
          explanation: "Sum of 1+2+3+4+5 = 15"
        },
        {
          input: "arr = []",
          output: "0",
          explanation: "Sum of empty array should be 0"
        }
      ],
      discussions: []
    }
  };

  // Load problem based on ID
  useEffect(() => {
    if (problemId && problemsDatabase[problemId]) {
      setCurrentProblem(problemsDatabase[problemId]);
    } else {
      // Default to problem 1 if no ID or invalid ID
      setCurrentProblem(problemsDatabase[1]);
    }
  }, [problemId]);

  // Mock submission history
  const mockSubmissions = [
    {
      id: 1,
      status: "Accepted",
      language: "JavaScript",
      runtime: 68,
      memory: 42.1,
      timestamp: "2 minutes ago",
      testCasesPassed: 57,
      totalTestCases: 57,
      performance: {
        runtimePercentile: 85,
        memoryPercentile: 92
      }
    },
    {
      id: 2,
      status: "Wrong Answer",
      language: "JavaScript",
      timestamp: "5 minutes ago",
      testCasesPassed: 45,
      totalTestCases: 57,
      errorMessage: "Expected [0,1] but got [1,0]"
    },
    {
      id: 3,
      status: "Time Limit Exceeded",
      language: "Python",
      timestamp: "8 minutes ago",
      testCasesPassed: 23,
      totalTestCases: 57
    }
  ];

  useEffect(() => {
    setSubmissions(mockSubmissions);
  }, []);

  // ── Initialize integrity logger ──
  useEffect(() => {
    integrityLogger.init({
      studentId: 'current_student',
      assignmentId: problemId || 'practice',
      examMode: false,
    });
    return () => integrityLogger.destroy();
  }, [problemId]);

  // ── Paste detection (handled by SecureMonacoEditor) ──
  const handlePasteDetected = useCallback(({ charCount, wordCount, snippet, blocked }) => {
    setPasteWarnings(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      words: wordCount,
      snippet: snippet || '',
      blocked: !!blocked,
    }]);
  }, []);

  // ── Block paste at document level as safety net ──
  useEffect(() => {
    const blockPaste = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const p = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      const wc = p.trim().split(/\s+/).filter(Boolean).length;
      if (wc > 0) {
        handlePasteDetected({
          charCount: p.length,
          wordCount: wc,
          snippet: p.slice(0, 80),
          blocked: true,
        });
      }
    };
    document.addEventListener('paste', blockPaste, true);
    return () => document.removeEventListener('paste', blockPaste, true);
  }, [handlePasteDetected]);

  // ── Keyboard shortcut interception ──
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleRunCode = async (code, language) => {
    setIsRunning(true);
    setShowTestResults(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        status: "success",
        passed: 3,
        total: 3,
        console: `Running test cases...\nTest case 1: PASSED\nTest case 2: PASSED\nTest case 3: PASSED\n\nAll tests passed!`,
        testCases: [
          {
            status: "passed",
            input: "[2,7,11,15], target = 9",
            expected: "[0,1]",
            output: "[0,1]",
            runtime: 68,
            memory: 42.1
          },
          {
            status: "passed",
            input: "[3,2,4], target = 6",
            expected: "[1,2]",
            output: "[1,2]",
            runtime: 72,
            memory: 41.8
          },
          {
            status: "passed",
            input: "[3,3], target = 6",
            expected: "[0,1]",
            output: "[0,1]",
            runtime: 65,
            memory: 42.3
          }
        ],
        performance: {
          runtime: 68,
          memory: 42.1,
          runtimePercentile: 85,
          memoryPercentile: 92,
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          attempts: 3,
          successRate: 100
        }
      };
      
      setTestResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmitCode = async (code, language) => {
    setIsSubmitting(true);
    
    // Log submission to integrity system
    integrityLogger.log(INTEGRITY_EVENTS.CODE_SUBMITTED, {
      assignment_id: problemId || 'practice',
      paste_warnings: pasteWarnings.length,
    });
    const report = integrityLogger.generateReport();
    console.log('Integrity Report:', report);

    // Simulate API call
    setTimeout(() => {
      const newSubmission = {
        id: submissions?.length + 1,
        status: "Accepted",
        language: language?.charAt(0)?.toUpperCase() + language?.slice(1),
        runtime: 68,
        memory: 42.1,
        timestamp: "Just now",
        testCasesPassed: 57,
        totalTestCases: 57,
        performance: {
          runtimePercentile: 85,
          memoryPercentile: 92
        }
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      setIsSubmitting(false);
      setShowSuccessAnimation(true);
    }, 3000);
  };

  const handleViewSubmission = (submission) => {
    // Implementation for viewing submission code
  };

  const handleInviteUser = async (email) => {
    // Simulate invite API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // User invited successfully
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!currentProblem ? (
        <div className="pt-16 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading problem...</p>
          </div>
        </div>
      ) : (
        <div className="pt-16 h-screen flex flex-col">
          {/* Collaborative Mode */}
          <CollaborativeMode
            isActive={showCollaborativeMode}
            onToggle={() => setShowCollaborativeMode(!showCollaborativeMode)}
            onInviteUser={handleInviteUser}
          />

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Problem Panel */}
            <div className="w-1/2 border-r border-border">
              <ProblemPanel
                problem={currentProblem}
                onToggleHints={() => setShowHints(!showHints)}
                showHints={showHints}
              />
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {/* Paste Warnings Bar */}
              {pasteWarnings.length > 0 && (
                <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-700 text-sm">
                  <Icon name="AlertTriangle" size={14} />
                  <span className="font-medium">{pasteWarnings.length} paste event(s) blocked</span>
                  <span className="text-xs text-amber-500">— flagged for instructor review</span>
                </div>
              )}
              <div className="flex-1">
                <CodeEditor
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  pastePolicy="block"
                  onPasteDetected={handlePasteDetected}
                />
              </div>

              {/* Test Results Panel */}
              <TestResults
                results={testResults}
                isVisible={showTestResults}
                onToggle={() => setShowTestResults(!showTestResults)}
              />
            </div>

            {/* Learning Aids Sidebar */}
            {showLearningAids && (
              <div className="w-80 border-l border-border bg-background overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      🧠 Learning Aids
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLearningAids(false)}
                      iconName="X"
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Algorithm Animation */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center">
                      🎬 Algorithm Animation
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-center mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Hash Map Approach</div>
                        <div className="flex justify-center space-x-2 mb-3">
                          {[2, 7, 11, 15].map((num, idx) => (
                            <div key={idx} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                              idx <= 1 ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {num}
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Target: 9</div>
                        <div className="text-xs text-green-700 font-medium">Found: indices [0,1] → 2+7=9</div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        ▶️ Play Animation
                      </Button>
                    </div>
                  </div>

                  {/* Code Walkthrough */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center">
                      👨‍💻 Code Walkthrough
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800 mb-1">Step 1: Initialize</div>
                        <code className="text-xs text-yellow-700">hash_map = {}</code>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-1">Step 2: Iterate</div>
                        <code className="text-xs text-blue-700">for i, num in enumerate(nums):</code>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-sm font-medium text-green-800 mb-1">Step 3: Check</div>
                        <code className="text-xs text-green-700">if complement in hash_map:</code>
                      </div>
                    </div>
                  </div>

                  {/* Common Mistakes */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center">
                      ⚠️ Common Mistakes
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="text-sm font-medium text-red-800 mb-1">Off-by-one errors</div>
                        <div className="text-xs text-red-700">Make sure array indices are correct</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="text-sm font-medium text-orange-800 mb-1">Using same element twice</div>
                        <div className="text-xs text-orange-700">Check indices before returning</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="text-sm font-medium text-purple-800 mb-1">Not handling duplicates</div>
                        <div className="text-xs text-purple-700">Consider how to handle duplicate values</div>
                      </div>
                    </div>
                  </div>

                  {/* Similar Problems */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center">
                      🔗 Similar Problems
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="text-sm font-medium text-gray-800">Three Sum</div>
                        <div className="text-xs text-gray-600">Medium • Uses similar hash map logic</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="text-sm font-medium text-gray-800">Two Sum II</div>
                        <div className="text-xs text-gray-600">Easy • Sorted array variation</div>
                      </div>
                    </div>
                  </div>

                  {/* Time/Space Complexity Guide */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center">
                      ⏱️ Complexity Analysis
                    </h4>
                    <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg p-4 border border-indigo-200">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-indigo-700">O(n)</div>
                          <div className="text-xs text-indigo-600">Time</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-cyan-700">O(n)</div>
                          <div className="text-xs text-cyan-600">Space</div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 text-center">
                        Single pass with hash map lookup
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submission History Sidebar */}
            {showSubmissionHistory && (
              <SubmissionHistory
                submissions={submissions}
                isVisible={showSubmissionHistory}
                onToggle={() => setShowSubmissionHistory(!showSubmissionHistory)}
                onViewSubmission={handleViewSubmission}
              />
            )}
          </div>

          {/* Floating Action Buttons */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
            <Button
              variant={showLearningAids ? "default" : "outline"}
              onClick={() => setShowLearningAids(!showLearningAids)}
              iconName="BookOpen"
              className="rounded-full w-12 h-12 p-0"
            />
            <Button
              variant={showSubmissionHistory ? "default" : "outline"}
              onClick={() => setShowSubmissionHistory(!showSubmissionHistory)}
              iconName="History"
              className="rounded-full w-12 h-12 p-0"
            />
            <Button
              variant={showCollaborativeMode ? "default" : "outline"}
              onClick={() => setShowCollaborativeMode(!showCollaborativeMode)}
              iconName="Users"
              className="rounded-full w-12 h-12 p-0"
            />
          </div>

          {/* Success Animation */}
          <SuccessAnimation
            isVisible={showSuccessAnimation}
            onClose={() => setShowSuccessAnimation(false)}
            submissionData={{
              runtime: 68,
              memory: 42.1,
              runtimePercentile: 85,
              memoryPercentile: 92
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProblemWorkspace;