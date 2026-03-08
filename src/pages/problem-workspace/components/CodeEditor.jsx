import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import SecureMonacoEditor from '../../../components/SecureEditor/SecureMonacoEditor';

const CodeEditor = ({ onRunCode, onSubmitCode, isRunning, isSubmitting, pastePolicy, onPasteDetected }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'scala', label: 'Scala' },
    { value: 'dart', label: 'Dart' }
  ];

  const fontSizeOptions = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 18, label: '18px' },
    { value: 20, label: '20px' }
  ];

  const getDefaultCode = (language) => {
    const templates = {
      javascript: `function solution(nums) {
    // Write your code here
    return [];
}

// Test your solution
console.log(solution([1, 2, 3]));`,
      python: `def solution(nums):
    # Write your code here
    return []

# Test your solution
print(solution([1, 2, 3]))`,
      java: `public class Solution {
    public int[] solution(int[] nums) {
        // Write your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.solution(new int[]{1, 2, 3});
        System.out.println(Arrays.toString(result));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums) {
        // Write your code here
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 2, 3};
    vector<int> result = sol.solution(nums);
    return 0;
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* solution(int* nums, int numsSize, int* returnSize) {
    // Write your code here
    *returnSize = 0;
    return NULL;
}

int main() {
    int nums[] = {1, 2, 3};
    int returnSize;
    int* result = solution(nums, 3, &returnSize);
    return 0;
}`
    };
    return templates?.[language] || templates?.javascript;
  };

  useEffect(() => {
    setCode(getDefaultCode(selectedLanguage));
  }, [selectedLanguage]);

  const handleKeyDown = (e) => {
    if (e?.key === 'Tab') {
      e?.preventDefault();
      const start = e?.target?.selectionStart;
      const end = e?.target?.selectionEnd;
      const newCode = code?.substring(0, start) + '    ' + code?.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
    
    if ((e?.ctrlKey || e?.metaKey) && e?.key === 'Enter') {
      e?.preventDefault();
      onRunCode(code, selectedLanguage);
    }
  };

  const handleRunCode = () => {
    onRunCode(code, selectedLanguage);
  };

  const handleSubmitCode = () => {
    onSubmitCode(code, selectedLanguage);
  };

  const insertSnippet = (snippet) => {
    const textarea = textareaRef?.current;
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const newCode = code?.substring(0, start) + snippet + code?.substring(end);
    setCode(newCode);
    
    setTimeout(() => {
      textarea?.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet?.length;
    }, 0);
  };

  const commonSnippets = {
    javascript: [
      { label: 'For Loop', code: 'for (let i = 0; i < arr.length; i++) {\n    \n}' },
      { label: 'Map', code: 'arr.map(item => {\n    return item;\n})' },
      { label: 'Filter', code: 'arr.filter(item => {\n    return condition;\n})' }
    ],
    python: [
      { label: 'For Loop', code: 'for i in range(len(arr)):\n    ' },
      { label: 'List Comprehension', code: '[item for item in arr if condition]' },
      { label: 'Dictionary', code: 'dict = {}\nfor key, value in items:\n    dict[key] = value' }
    ]
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Editor Header */}
      <div className="flex-shrink-0 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              options={languages}
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              className="w-40"
            />
            <Select
              options={fontSizeOptions}
              value={fontSize}
              onChange={setFontSize}
              className="w-24"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleRunCode}
              loading={isRunning}
              iconName="Play"
              iconPosition="left"
              disabled={isSubmitting}
            >
              Run Code
            </Button>
            <Button
              variant="default"
              onClick={handleSubmitCode}
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
              disabled={isRunning}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Code Snippets */}
        {commonSnippets?.[selectedLanguage] && (
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-muted-foreground">Quick snippets:</span>
            {commonSnippets?.[selectedLanguage]?.map((snippet, index) => (
              <button
                key={index}
                onClick={() => insertSnippet(snippet?.code)}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-border academic-transition"
              >
                {snippet?.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Code Editor Area */}
      <div className="flex-1 relative">
        <SecureMonacoEditor
          height="100%"
          language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'csharp' ? 'csharp' : selectedLanguage}
          value={code}
          onChange={(val) => setCode(val || '')}
          pastePolicy={pastePolicy || "allow"}
          onPasteDetected={onPasteDetected}
          fontSize={fontSize}
          minimap={false}
        />
      </div>
      {/* Editor Footer */}
      <div className="flex-shrink-0 border-t border-border px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Lines: {code?.split('\n')?.length}</span>
            <span>Characters: {code?.length}</span>
            <span>Language: {languages?.find(l => l?.value === selectedLanguage)?.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Keyboard" size={14} />
            <span>Ctrl+Enter to run</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;