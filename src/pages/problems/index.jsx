import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import StyledCard from '../../components/ui/StyledCard';

const Problems = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Problem categories like LeetCode
  const categories = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Classic coding problems and algorithms',
      icon: '🧮',
      color: 'bg-gray-800',
      accent: 'text-cyan-400',
      chapters: 12,
      items: 1847,
      progress: 0,
      tags: ['Array', 'String', 'LinkedList', 'Tree', 'Graph', 'Dynamic Programming']
    },
    {
      id: 'debugging',
      title: 'Debugging Challenges',
      description: 'Find and fix bugs in existing code',
      icon: '🐛',
      color: 'bg-gray-800',
      accent: 'text-red-400',
      chapters: 5,
      items: 156,
      progress: 0,
      tags: ['Logic Errors', 'Runtime Errors', 'Syntax Errors', 'Edge Cases']
    },
    {
      id: 'nptel',
      title: 'NPTEL Courses',
      description: 'Programming assignments from NPTEL courses',
      icon: '🎓',
      color: 'bg-gray-800',
      accent: 'text-green-400',
      chapters: 8,
      items: 234,
      progress: 0,
      tags: ['C Programming', 'Java', 'Python', 'Computer Networks', 'OS']
    },
    {
      id: 'competitive',
      title: 'Competitive Programming',
      description: 'Contest-style programming challenges',
      icon: '🏆',
      color: 'bg-gray-800',
      accent: 'text-purple-400',
      chapters: 15,
      items: 892,
      progress: 0,
      tags: ['Contest', 'Math', 'Greedy', 'Number Theory', 'Geometry']
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Large-scale system design problems',
      icon: '🏗️',
      color: 'bg-gray-800',
      accent: 'text-orange-400',
      chapters: 4,
      items: 67,
      progress: 0,
      tags: ['Scalability', 'Database', 'Architecture', 'Microservices']
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      description: 'Common interview questions from top companies',
      icon: '💼',
      color: 'bg-gray-800',
      accent: 'text-blue-400',
      chapters: 10,
      items: 445,
      progress: 0,
      tags: ['Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple']
    }
  ];

  // Mock problems data for selected category
  const getProblemsForCategory = (categoryId) => {
    const problems = {
      dsa: [
        {
          id: 1,
          title: 'Two Sum',
          difficulty: 'Easy',
          acceptance: '49.1%',
          tags: ['Array', 'Hash Table'],
          isPremium: false,
          likes: 25420,
          dislikes: 834,
          companies: ['Amazon', 'Google', 'Microsoft']
        },
        {
          id: 2,
          title: 'Add Two Numbers',
          difficulty: 'Medium',
          acceptance: '36.9%',
          tags: ['LinkedList', 'Math', 'Recursion'],
          isPremium: false,
          likes: 18240,
          dislikes: 3641,
          companies: ['Amazon', 'Microsoft', 'Apple']
        },
        {
          id: 3,
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          acceptance: '33.8%',
          tags: ['Hash Table', 'String', 'Sliding Window'],
          isPremium: false,
          likes: 29384,
          dislikes: 1284,
          companies: ['Amazon', 'Google', 'Facebook']
        },
        {
          id: 4,
          title: 'Median of Two Sorted Arrays',
          difficulty: 'Hard',
          acceptance: '35.2%',
          tags: ['Array', 'Binary Search', 'Divide and Conquer'],
          isPremium: false,
          likes: 18392,
          dislikes: 2031,
          companies: ['Google', 'Microsoft', 'Adobe']
        },
        {
          id: 5,
          title: 'Longest Palindromic Substring',
          difficulty: 'Medium',
          acceptance: '32.1%',
          tags: ['String', 'Dynamic Programming'],
          isPremium: false,
          likes: 22839,
          dislikes: 1394,
          companies: ['Amazon', 'Microsoft', 'Google']
        }
      ],
      debugging: [
        {
          id: 101,
          title: 'Fix the Array Sum Bug',
          difficulty: 'Easy',
          acceptance: '78.3%',
          tags: ['Logic Errors', 'Array'],
          isPremium: false,
          likes: 1240,
          dislikes: 45,
          companies: ['Various']
        },
        {
          id: 102,
          title: 'Memory Leak Detection',
          difficulty: 'Hard',
          acceptance: '23.7%',
          tags: ['Memory Management', 'C++'],
          isPremium: true,
          likes: 856,
          dislikes: 123,
          companies: ['Systems Companies']
        }
      ],
      nptel: [
        {
          id: 201,
          title: 'C Programming Assignment 1',
          difficulty: 'Easy',
          acceptance: '85.2%',
          tags: ['C Programming', 'Basics'],
          isPremium: false,
          likes: 789,
          dislikes: 23,
          companies: ['Academic']
        },
        {
          id: 202,
          title: 'Data Structures Lab',
          difficulty: 'Medium',
          acceptance: '67.4%',
          tags: ['Data Structures', 'Implementation'],
          isPremium: false,
          likes: 1234,
          dislikes: 67,
          companies: ['Academic']
        }
      ]
    };
    return problems[categoryId] || [];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleProblemClick = (problem) => {
    // Navigate to problem workspace with problem ID
    navigate(`/problem-workspace?id=${problem.id}`);
  };

  const filteredProblems = selectedCategory ? 
    getProblemsForCategory(selectedCategory.id)
      .filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (problem.companies && problem.companies.some(company => company.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
        const matchesTag = selectedTag === 'all' || problem.tags.includes(selectedTag);
        const matchesCompany = selectedCompany === 'all' || (problem.companies && problem.companies.includes(selectedCompany));
        return matchesSearch && matchesDifficulty && matchesTag && matchesCompany;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'difficulty':
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            break;
          case 'acceptance':
            comparison = parseFloat(a.acceptance) - parseFloat(b.acceptance);
            break;
          case 'likes':
            comparison = a.likes - b.likes;
            break;
          case 'frequency':
            comparison = (a.companies?.length || 0) - (b.companies?.length || 0);
            break;
          case 'id':
            comparison = a.id - b.id;
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      }) : [];

  const allTags = selectedCategory ? [...new Set(selectedCategory.tags)] : [];
  
  // Get all unique companies from problems
  const allCompanies = selectedCategory ? 
    [...new Set(getProblemsForCategory(selectedCategory.id).flatMap(p => p.companies || []))] : [];

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Practice Problems</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sharpen your coding skills with our comprehensive collection of programming challenges.
                Choose from various categories and difficulty levels.
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {categories.map((category, index) => (
                <div key={category.id} onClick={() => setSelectedCategory(category)}>
                  <StyledCard category={category} colorIndex={index} />
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="mt-16 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Practice Here?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Code" size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real IDE Experience</h3>
                  <p className="text-gray-600">Practice with our advanced code editor supporting multiple languages</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Feedback</h3>
                  <p className="text-gray-600">Get immediate test results and detailed performance metrics</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Discussions</h3>
                  <p className="text-gray-600">Learn from others and share your solutions with the community</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Problems listing view for selected category
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={20} />
              <span>Back to Categories</span>
            </button>
          </div>

          {/* Category Header */}
          <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 text-white mb-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full -ml-24 -mb-24"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border border-white/20">
                    {selectedCategory.icon}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{selectedCategory.title}</h1>
                    <p className="text-blue-100 text-lg font-medium">{selectedCategory.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-3xl font-bold">{filteredProblems.length}</div>
                    <div className="text-blue-100 text-sm">Available Problems</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={20} className="text-blue-300" />
                    <div>
                      <div className="text-xl font-bold">{selectedCategory.items}</div>
                      <div className="text-blue-100 text-xs">Total Problems</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Icon name="Tag" size={20} className="text-purple-300" />
                    <div>
                      <div className="text-xl font-bold">{selectedCategory.tags.length}</div>
                      <div className="text-blue-100 text-xs">Topic Areas</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Icon name="TrendingUp" size={20} className="text-green-300" />
                    <div>
                      <div className="text-xl font-bold">{Math.floor(Math.random() * 30 + 60)}%</div>
                      <div className="text-blue-100 text-xs">Avg Success Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Icon name="Clock" size={20} className="text-orange-300" />
                    <div>
                      <div className="text-xl font-bold">{Math.floor(Math.random() * 20 + 15)}m</div>
                      <div className="text-blue-100 text-xs">Avg Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Sticky Filter Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 mb-6 sticky top-16 z-30">
            {/* Collapsed Bar — always visible */}
            <div className="flex items-center gap-3 px-4 py-2.5">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Icon name="Search" size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Icon name="X" size={13} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Quick difficulty pills */}
              <div className="hidden md:flex items-center gap-1.5">
                {['all', 'Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedDifficulty === d
                        ? d === 'Easy' ? 'bg-green-100 text-green-700' :
                          d === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          d === 'Hard' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {d === 'all' ? 'All' : d}
                  </button>
                ))}
              </div>

              {/* Active filter count badge + expand toggle */}
              <button
                onClick={() => setFiltersExpanded(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Icon name="SlidersHorizontal" size={14} className="text-gray-500" />
                <span className="text-gray-600">Filters</span>
                {(selectedTag !== 'all' || selectedCompany !== 'all' || sortBy !== 'default') && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {[selectedTag !== 'all', selectedCompany !== 'all', sortBy !== 'default'].filter(Boolean).length}
                  </span>
                )}
                <Icon name={filtersExpanded ? "ChevronUp" : "ChevronDown"} size={13} className="text-gray-400" />
              </button>

              {/* Clear all */}
              {(searchTerm || selectedDifficulty !== 'all' || selectedTag !== 'all' || selectedCompany !== 'all' || sortBy !== 'default') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDifficulty('all');
                    setSelectedTag('all');
                    setSelectedCompany('all');
                    setSortBy('default');
                    setSortOrder('desc');
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Expanded filter row */}
            {filtersExpanded && (
              <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Topics */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Topic</label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="all">All Topics</option>
                      {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                  </div>

                  {/* Companies */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Company</label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="all">All Companies</option>
                      {allCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="default">Default</option>
                      <option value="title">Title</option>
                      <option value="difficulty">Difficulty</option>
                      <option value="acceptance">Acceptance</option>
                      <option value="likes">Popularity</option>
                      <option value="frequency">Frequency</option>
                      <option value="id">Problem ID</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>

                {/* Active filter chips */}
                {(selectedTag !== 'all' || selectedCompany !== 'all' || sortBy !== 'default') && (
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    {selectedTag !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700">
                        {selectedTag}
                        <button onClick={() => setSelectedTag('all')}><Icon name="X" size={10} /></button>
                      </span>
                    )}
                    {selectedCompany !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700">
                        {selectedCompany}
                        <button onClick={() => setSelectedCompany('all')}><Icon name="X" size={10} /></button>
                      </span>
                    )}
                    {sortBy !== 'default' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700">
                        Sort: {sortBy}
                        <button onClick={() => { setSortBy('default'); setSortOrder('desc'); }}><Icon name="X" size={10} /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Problems Grid/List */}
          <div className="space-y-4">
            {/* Results Summary and Quick Actions */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{filteredProblems.length}</span>
                  <span className="text-sm font-medium text-gray-600">problems found</span>
                </div>
                
                {(searchTerm || selectedDifficulty !== 'all' || selectedTag !== 'all' || selectedCompany !== 'all') && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Icon name="Filter" size={16} />
                    <span>Filtered from {getProblemsForCategory(selectedCategory.id).length} total</span>
                  </div>
                )}
                
                {sortBy !== 'default' && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <Icon name="ArrowUpDown" size={14} />
                    <span>Sorted by {sortBy} ({sortOrder})</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDifficulty('all');
                    setSelectedTag('all');
                    setSelectedCompany('all');
                    setSortBy('default');
                    setSortOrder('desc');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                  disabled={!searchTerm && selectedDifficulty === 'all' && selectedTag === 'all' && selectedCompany === 'all' && sortBy === 'default'}
                >
                  <Icon name="RotateCcw" size={14} />
                  <span>Reset All</span>
                </button>
                
                <div className="h-4 w-px bg-gray-300"></div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">View:</span>
                  <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                    Cards
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded">
                    Table
                  </button>
                </div>
              </div>
            </div>

            {/* Problems Cards */}
            <div className="space-y-3">
              {filteredProblems.map((problem, index) => (
                <div
                  key={problem.id}
                  onClick={() => handleProblemClick(problem)}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="p-6 relative">
                    <div className="flex items-center justify-between">
                      {/* Left side - Problem info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-400">#{problem.id}</span>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {problem.title}
                            </h3>
                            {problem.isPremium && (
                              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                <Icon name="Crown" size={12} />
                                <span>Premium</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {problem.tags.map((tag, tagIndex) => (
                            <span 
                              key={tag} 
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:scale-105 transform cursor-pointer ${
                                tagIndex === 0 ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                tagIndex === 1 ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                                tagIndex === 2 ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Companies */}
                        {problem.companies && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                            <Icon name="Building" size={12} />
                            <span>Asked by: {problem.companies.slice(0, 3).join(', ')}</span>
                            {problem.companies.length > 3 && <span>+{problem.companies.length - 3} more</span>}
                          </div>
                        )}

                        {/* 🧩 Problem Insights */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs">🧠</span>
                              <span className="text-xs font-medium text-blue-700">Core Concepts</span>
                            </div>
                            <div className="text-xs text-blue-600">
                              {problem.tags.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs">📈</span>
                              <span className="text-xs font-medium text-green-700">Trend</span>
                            </div>
                            <div className="text-xs text-green-600">
                              {Math.random() > 0.5 ? '↗️ Getting Easier' : '↘️ Getting Harder'}
                            </div>
                          </div>
                          
                          <div className="bg-purple-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs">🧪</span>
                              <span className="text-xs font-medium text-purple-700">Test Coverage</span>
                            </div>
                            <div className="text-xs text-purple-600">
                              {Math.floor(Math.random() * 30 + 70)}% Robust
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs">💬</span>
                              <span className="text-xs font-medium text-orange-700">Frequency</span>
                            </div>
                            <div className="text-xs text-orange-600">
                              {problem.companies?.length || 0} Companies
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className="flex items-center space-x-8">
                        {/* Difficulty */}
                        <div className="text-center">
                          <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${
                            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              problem.difficulty === 'Easy' ? 'bg-green-500' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            {problem.difficulty}
                          </div>
                        </div>

                        {/* Acceptance Rate */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{problem.acceptance}</div>
                          <div className="text-xs text-gray-500 font-medium">Acceptance</div>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: problem.acceptance }}
                            ></div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div className="text-center">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Icon name="ThumbsUp" size={16} className="text-green-500" />
                              <span className="text-sm font-semibold text-green-600">{(problem.likes / 1000).toFixed(1)}k</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon name="ThumbsDown" size={16} className="text-red-500" />
                              <span className="text-sm font-semibold text-red-600">{problem.dislikes}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((problem.likes / (problem.likes + problem.dislikes)) * 100)}% positive
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="text-center">
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <div className="flex items-center space-x-2">
                              <Icon name="Play" size={16} />
                              <span>Solve</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar at bottom */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} />
                            <span>Avg. Time: {Math.floor(Math.random() * 30 + 10)} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Users" size={12} />
                            <span>{(Math.random() * 50000 + 10000).toFixed(0)} submissions</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Icon name="Bookmark" size={14} className="text-gray-400 hover:text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Icon name="Share" size={14} className="text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {filteredProblems.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Search" size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDifficulty('all');
                    setSelectedTag('all');
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problems;
