import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ForumFeed from './components/ForumFeed';
import ForumPost from './components/ForumPost';

const CampusForums = () => {
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('hot');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [createPostType, setCreatePostType] = useState('text');
  const [viewMode, setViewMode] = useState('social'); // 'social' or 'forum'
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Mock friend requests data
  const mockFriendRequests = [
    {
      id: 1,
      user: { name: "Prathamesh Pawar", username: "prathameshp", avatar: "👨‍💻", year: "3rd Year IT" },
      mutualFriends: 5,
      timestamp: "2h"
    },
    {
      id: 2,
      user: { name: "Sarang Thakare", username: "sarangt", avatar: "👨‍🎓", year: "3rd Year IT" },
      mutualFriends: 8,
      timestamp: "1d"
    }
  ];

  // Twitter-style Posts Data for Forum Mode
  const twitterStylePosts = [
    {
      id: 1,
      user: {
        name: "Aditya Deore",
        username: "@aditya_dev",
        avatar: "👨‍💻",
        verified: true,
        followers: "2.5K"
      },
      content: "Spent the whole night refactoring our CodeCampus project from Express+MongoDB to a fully static React app with Firebase 🔥 Removed the entire server folder, rewired services... and it actually works now! Clean architecture hits different. #React #Firebase #Refactoring",
      timestamp: "2h",
      likes: 847,
      retweets: 234,
      comments: 56,
      views: "12.5K",
      isLiked: false,
      isRetweeted: false,
      type: "text",
      hashtags: ["React", "Firebase", "Refactoring"],
      mentions: [],
      replies: [
        {
          id: 101,
          user: { name: "Prathamesh Pawar", username: "@prathamesh_dev", avatar: "👨‍💻", verified: false },
          content: "Bro that migration was insane, I saw the commit diff — 40+ files changed 😅 respect!",
          timestamp: "1h",
          likes: 125,
          replies: []
        },
        {
          id: 102,
          user: { name: "Chinmay Ahire", username: "@chinmay_codes", avatar: "👨‍🎓", verified: true },
          content: "This is why I always say plan your architecture before writing a single line. Good stuff Aditya 💯",
          timestamp: "45m",
          likes: 89,
          replies: []
        }
      ]
    },
    {
      id: 2,
      user: {
        name: "Prathamesh Pawar",
        username: "@prathamesh_dev",
        avatar: "👨‍💻",
        verified: false,
        followers: "1.2K"
      },
      content: "Finally cracked Tailwind CSS after struggling with it for weeks 🎨\n\nMy workflow now:\n• Design in Figma\n• Build with Tailwind utility classes\n• Use @apply for reusable components\n• Dark mode with class strategy\n\nProductivity went up 3x honestly. #TailwindCSS #Frontend #WebDev",
      timestamp: "4h",
      likes: 1205,
      retweets: 456,
      comments: 78,
      views: "24.8K",
      isLiked: true,
      isRetweeted: false,
      type: "text",
      hashtags: ["TailwindCSS", "Frontend", "WebDev"],
      mentions: [],
      replies: [
        {
          id: 201,
          user: { name: "Sarang Thakare", username: "@sarang_tech", avatar: "👨‍🎓", verified: true },
          content: "Tailwind is a game changer once you get past the initial learning curve. Try the typography plugin too!",
          timestamp: "3h",
          likes: 67,
          replies: []
        }
      ]
    },
    {
      id: 3,
      user: {
        name: "CodeCampus",
        username: "@codecampus_official",
        avatar: "🏫",
        verified: true,
        followers: "15.2K"
      },
      content: "📢 ANNOUNCEMENT: IT Department is hosting a 48-hour hackathon next weekend! \n\n🏆 Prizes: ₹50K total\n🗓️ Date: Mar 14-16\n💻 Theme: AI-Powered Education Tools\n\nRegistration opens tomorrow at 9 AM. Who's in? #Hackathon #AI #EdTech #CodeCampus",
      timestamp: "6h",
      likes: 2341,
      retweets: 1205,
      comments: 234,
      views: "56.7K",
      isLiked: false,
      isRetweeted: true,
      type: "announcement",
      hashtags: ["Hackathon", "AI", "EdTech", "CodeCampus"],
      mentions: [],
      replies: []
    },
    {
      id: 4,
      user: {
        name: "Chinmay Ahire",
        username: "@chinmay_codes",
        avatar: "👨‍🎓",
        verified: true,
        followers: "8.9K"
      },
      content: "Hot take: You should learn C and pointers before jumping into Python or JavaScript 🔥\n\nUnderstanding memory management, stack vs heap, and how data actually lives in memory makes you 10x better at debugging in ANY language.\n\nThoughts? 🤔 #Programming #DSA #ComputerScience",
      timestamp: "8h",
      likes: 3456,
      retweets: 892,
      comments: 167,
      views: "78.3K",
      isLiked: true,
      isRetweeted: false,
      type: "text",
      hashtags: ["Programming", "DSA", "ComputerScience"],
      mentions: [],
      replies: [
        {
          id: 401,
          user: { name: "Sarang Thakare", username: "@sarang_tech", avatar: "👨‍🎓", verified: false },
          content: "Facts. Once you understand how malloc works, everything else is a cakewalk. Pointers changed my perspective.",
          timestamp: "7h",
          likes: 234,
          replies: []
        }
      ]
    },
    {
      id: 5,
      user: {
        name: "Sarang Thakare",
        username: "@sarang_tech",
        avatar: "👨‍🎓",
        verified: false,
        followers: "892"
      },
      content: "Implemented a BST visualizer in React using Canvas API today! 🌳\n\nYou can insert, delete, and watch in-order traversal animate step by step. Built it for our DSA assignment but might open source it.\n\nWho wants the GitHub link? 👇 #DSA #React #OpenSource #BinarySearchTree",
      timestamp: "12h",
      likes: 567,
      retweets: 123,
      comments: 45,
      views: "15.6K",
      isLiked: false,
      isRetweeted: false,
      type: "thread",
      hashtags: ["DSA", "React", "OpenSource", "BinarySearchTree"],
      mentions: [],
      replies: []
    }
  ];

  // Original Forum Posts Data (simple forum style)
  const originalForumPosts = [
    {
      id: 1,
      title: "How to optimize React component rendering?",
      content: "I'm building CodeCampus and some pages with lots of state are laggy. Already using React.memo on child components but the parent still re-renders everything. What else should I try?",
      author: {
        name: "Aditya Deore",
        level: "Intermediate",
        branch: "Information Technology",
        verified: true
      },
      category: "Technical Help",
      tags: ["React", "Performance", "JavaScript"],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      upvotes: 24,
      downvotes: 2,
      isQuestion: true,
      replies: [
        {
          id: 101,
          content: "Try useCallback for your event handlers and useMemo for expensive computed values. Also check if you're passing new object/array literals as props — those break memoization every render.",
          author: { name: "Prathamesh Pawar", level: "Expert" },
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          upvotes: 12,
          downvotes: 0
        }
      ],
      isBookmarked: false
    },
    {
      id: 2,
      title: "Firebase Auth vs Custom JWT — which one for college projects?",
      content: "Starting a new project and confused between Firebase Authentication and building my own JWT-based auth. Firebase seems easier but I want to understand the concepts too. What do you guys prefer?",
      author: {
        name: "Chinmay Ahire",
        level: "Beginner",
        branch: "Information Technology",
        verified: false
      },
      category: "Technical Help", 
      tags: ["Firebase", "Authentication", "JWT"],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      upvotes: 18,
      downvotes: 1,
      isQuestion: true,
      replies: [
        {
          id: 201,
          content: "For college projects Firebase Auth is perfect — it handles email/password, Google sign-in, and session management out of the box. Learn JWT concepts separately, don't complicate your project with it.",
          author: { name: "Sarang Thakare", level: "Advanced" },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          upvotes: 8,
          downvotes: 0
        }
      ],
      isBookmarked: true
    },
    {
      id: 3,
      title: "Built a complete academic integrity system for our college IDE",
      content: "Just finished building an integrity monitoring system that detects copy-paste events, tracks typing patterns, and even uses Gemini AI to flag AI-generated code. Open to feedback from anyone working on similar EdTech projects!",
      author: {
        name: "Prathamesh Pawar",
        level: "Intermediate", 
        branch: "Information Technology",
        verified: false
      },
      category: "Project Showcase",
      tags: ["EdTech", "Integrity", "AI Detection"],
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      upvotes: 35,
      downvotes: 3,
      isQuestion: false,
      replies: [
        {
          id: 301,
          content: "This is solid! How are you handling false positives with the AI detection? Sometimes students use common patterns that look AI-generated.",
          author: { name: "Chinmay Ahire", level: "Expert" },
          timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
          upvotes: 5,
          downvotes: 0
        }
      ],
      isBookmarked: false
    },
    {
      id: 4,
      title: "Best resources for learning Data Structures and Algorithms?",
      content: "DSA exam is coming up and I need to grind. Currently doing Striver's A2Z sheet but it's overwhelming. What resources helped you guys the most? Any specific YT channels or websites?",
      author: {
        name: "Sarang Thakare",
        level: "Beginner",
        branch: "Information Technology", 
        verified: false
      },
      category: "Academic Discussion",
      tags: ["DSA", "Interview", "Learning"],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      upvotes: 42,
      downvotes: 1,
      isQuestion: true,
      replies: [],
      isBookmarked: true
    }
  ];

  // Mock posts data with enhanced features
  const mockPosts = [
    {
      id: 1,
      user: {
        name: "Aditya Deore",
        username: "aditya_dev",
        avatar: "👨‍💻",
        verified: true,
        year: "3rd Year IT"
      },
      content: {
        type: "image",
        text: "CodeCampus v2 is live! 🚀 Rebuilt the entire frontend with React + Vite + Tailwind. Check out the new dark mode and Monaco editor integration.",
        images: [
          { id: 1, url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop", alt: "Code editor screenshot" },
          { id: 2, url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop", alt: "Dashboard view" },
          { id: 3, url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop", alt: "Dark mode UI" }
        ],
        tags: ["#ReactJS", "#Vite", "#TailwindCSS", "#MonacoEditor"]
      },
      timestamp: "2h",
      likes: 234,
      comments: 45,
      shares: 12,
      upvotes: 187,
      downvotes: 12,
      isLiked: false,
      isSaved: false,
      userVote: null,
      category: "Project Showcase",
      replies: []
    },
    {
      id: 2,
      user: {
        name: "Prathamesh Pawar",
        username: "prathameshp",
        avatar: "👨‍💻",
        verified: false,
        year: "3rd Year IT"
      },
      content: {
        type: "video",
        text: "Quick tutorial: Setting up Firebase Authentication with React in under 5 minutes! 🔐🚀",
        video: {
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
          duration: "4:52"
        },
        tags: ["#Firebase", "#React", "#Tutorial", "#Authentication"]
      },
      timestamp: "4h",
      likes: 189,
      comments: 32,
      shares: 8,
      upvotes: 156,
      downvotes: 7,
      isLiked: true,
      isSaved: false,
      userVote: 'up',
      category: "Tutorials",
      replies: []
    },
    {
      id: 3,
      user: {
        name: "Chinmay Ahire",
        username: "chinmaya",
        avatar: "👨‍🎓",
        verified: false,
        year: "3rd Year IT"
      },
      content: {
        type: "code",
        text: "Wrote a clean debounce hook for our search feature — no lodash needed 💡",
        code: `// useDebounce hook
const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};`,
        tags: ["#ReactJS", "#CustomHooks", "#CleanCode"]
      },
      timestamp: "6h",
      likes: 156,
      comments: 67,
      shares: 23,
      upvotes: 143,
      downvotes: 4,
      isLiked: false,
      isSaved: true,
      userVote: null,
      category: "Technical Help",
      replies: []
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
    setFriendRequests(mockFriendRequests);
    // Dependencies intentionally left empty: including mockPosts/mockFriendRequests (mock data recreated per render) would cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'hot':
          const aScore = (a.upvotes - a.downvotes) * 2 + a.comments * 3;
          const bScore = (b.upvotes - b.downvotes) * 2 + b.comments * 3;
          return bScore - aScore;
        case 'new':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'top':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        default:
          return 0;
      }
    });

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleVote = (postId, voteType) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote = null;

        if (voteType === 'up') {
          if (currentVote === 'up') {
            newUpvotes -= 1;
          } else {
            newUpvotes += 1;
            if (currentVote === 'down') newDownvotes -= 1;
            newUserVote = 'up';
          }
        } else {
          if (currentVote === 'down') {
            newDownvotes -= 1;
          } else {
            newDownvotes += 1;
            if (currentVote === 'up') newUpvotes -= 1;
            newUserVote = 'down';
          }
        }

        return { ...post, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
      }
      return post;
    }));
  };

  const handleSave = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleVideoToggle = (postId) => {
    setPlayingVideos(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleFriendRequest = (requestId, action) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleAddComment = (postId) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    const newReply = {
      id: Date.now(),
      user: { name: "Aditya Deore", username: "aditya_dev", avatar: "👨‍💻", verified: true },
      content: commentText,
      timestamp: "now",
      upvotes: 0,
      downvotes: 0,
      userVote: null
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, newReply], comments: post.comments + 1 }
        : post
    ));

    setNewComment(prev => ({ ...prev, [postId]: '' }));
  };

  // Instagram-style Post Component
  const InstagramPost = ({ post }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const renderContent = () => {
      switch (post.content.type) {
        case 'image':
          return (
            <>
              <p className="text-sm text-gray-900 mb-3 px-4">{post.content.text}</p>
              {post.content.images && (
                <div className="relative">
                  {/* Standard social media image aspect ratio (4:5 for single image, 16:9 for multiple) */}
                  <div className={`relative bg-black overflow-hidden ${
                    post.content.images.length === 1 
                      ? 'aspect-[4/5]' // Instagram standard single post ratio
                      : 'aspect-[16/9]' // Landscape ratio for multiple images
                  }`}>
                    <img 
                      src={post.content.images[currentImageIndex].url}
                      alt={post.content.images[currentImageIndex].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {post.content.images.length > 1 && (
                    <>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {post.content.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {currentImageIndex > 0 && (
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                        >
                          <Icon name="ChevronLeft" size={20} />
                        </button>
                      )}
                      {currentImageIndex < post.content.images.length - 1 && (
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev + 1)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                        >
                          <Icon name="ChevronRight" size={20} />
                        </button>
                      )}
                      
                      <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
                        {currentImageIndex + 1}/{post.content.images.length}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          );
        
        case 'video':
          return (
            <>
              <p className="text-sm text-gray-900 mb-3 px-4">{post.content.text}</p>
              {/* Standard video aspect ratio (16:9) */}
              <div className="relative aspect-[16/9] bg-black">
                {playingVideos[post.id] ? (
                  <video 
                    src={post.content.video.url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => handleVideoToggle(post.id)}
                  />
                ) : (
                  <>
                    <img 
                      src={post.content.video.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleVideoToggle(post.id)}
                        className="bg-black/70 text-white rounded-full p-4 hover:bg-black/80 transition-colors"
                      >
                        <Icon name="Play" size={32} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {post.content.video.duration}
                    </div>
                  </>
                )}
              </div>
            </>
          );

        case 'code':
          return (
            <>
              <p className="text-sm text-gray-900 mb-3 px-4">{post.content.text}</p>
              <div className="bg-gray-900 rounded-lg p-4 mx-4 mb-3 overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                  {post.content.code}
                </pre>
              </div>
            </>
          );

        default:
          return <p className="text-sm text-gray-900 mb-3 px-4">{post.content.text}</p>;
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
              {post.user.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-sm">{post.user.name}</h3>
                {post.user.verified && (
                  <Icon name="BadgeCheck" size={14} className="text-blue-500" />
                )}
                <span className="text-gray-400">·</span>
                <span className="text-xs text-gray-500">{post.timestamp}</span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">{post.user.year}</p>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {post.category}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
              <Icon name="TrendingUp" size={12} className="text-green-500" />
              <span className="text-xs font-medium text-gray-700">
                {post.upvotes - post.downvotes}
              </span>
            </div>
            <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
          </div>
        </div>

        {/* Post Content */}
        <div className="pb-3">
          {renderContent()}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3 px-4">
            {post.content.tags.map((tag, index) => (
              <span key={index} className="text-blue-600 text-sm hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Post Actions */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-6">
              {/* Reddit-style voting */}
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleVote(post.id, 'up')}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    post.userVote === 'up' ? 'text-orange-500' : 'text-gray-600'
                  }`}
                >
                  <Icon name="ChevronUp" size={20} />
                </button>
                <span className={`text-sm font-medium min-w-[20px] text-center ${
                  post.userVote === 'up' ? 'text-orange-500' : 
                  post.userVote === 'down' ? 'text-blue-500' : 'text-gray-700'
                }`}>
                  {post.upvotes - post.downvotes}
                </span>
                <button 
                  onClick={() => handleVote(post.id, 'down')}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    post.userVote === 'down' ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  <Icon name="ChevronDown" size={20} />
                </button>
              </div>

              {/* Instagram-style interactions */}
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1 hover:opacity-70"
              >
                <Icon 
                  name="Heart" 
                  size={20} 
                  className={post.isLiked ? "text-red-500 fill-current" : "text-gray-700"} 
                />
                <span className="text-sm text-gray-600">{post.likes}</span>
              </button>
              
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-1 hover:opacity-70"
              >
                <Icon name="MessageCircle" size={20} className="text-gray-700" />
                <span className="text-sm text-gray-600">{post.comments}</span>
              </button>
              
              <button className="flex items-center space-x-1 hover:opacity-70">
                <Icon name="Repeat2" size={20} className="text-gray-700" />
                <span className="text-sm text-gray-600">{post.shares}</span>
              </button>
              
              <button className="flex items-center space-x-1 hover:opacity-70">
                <Icon name="Send" size={20} className="text-gray-700" />
              </button>
            </div>
            
            <button 
              onClick={() => handleSave(post.id)}
              className="hover:opacity-70"
            >
              <Icon 
                name="Bookmark" 
                size={20} 
                className={post.isSaved ? "text-gray-900 fill-current" : "text-gray-700"} 
              />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments[post.id] && (
          <div className="border-t border-gray-200">
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs">
                  👤
                </div>
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={newComment[post.id] || ''}
                  onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                  className="flex-1 text-sm outline-none bg-gray-50 rounded-full px-4 py-2"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                />
                <button 
                  onClick={() => handleAddComment(post.id)}
                  className="text-blue-500 text-sm font-semibold hover:opacity-70 disabled:opacity-50"
                  disabled={!newComment[post.id]?.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Friend Requests Modal
  const FriendRequestsModal = () => (
    showFriendRequests && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Friend Requests</h2>
            <button 
              onClick={() => setShowFriendRequests(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                  {request.user.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{request.user.name}</h3>
                  <p className="text-xs text-gray-500">{request.user.year}</p>
                  <p className="text-xs text-gray-500">{request.mutualFriends} mutual friends</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleFriendRequest(request.id, 'accept')}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleFriendRequest(request.id, 'decline')}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );

  // Enhanced Create Post Modal with Image Upload and Poll Features
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollQuestion, setPollQuestion] = useState('');

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
            alt: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const addPollOption = () => {
    setPollOptions(prev => [...prev, '']);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index, value) => {
    setPollOptions(prev => prev.map((option, i) => i === index ? value : option));
  };

  const CreatePostModal = () => (
    showCreateModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create Post</h2>
            <button 
              onClick={() => {
                setShowCreateModal(false);
                setPostText('');
                setSelectedImages([]);
                setPollOptions(['', '']);
                setPollQuestion('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          {/* Post Type Selection */}
          <div className="flex space-x-2 mb-4">
            {[
              { type: 'text', icon: 'Type', label: 'Text' },
              { type: 'image', icon: 'Image', label: 'Photo' },
              { type: 'video', icon: 'Video', label: 'Video' },
              { type: 'code', icon: 'Code', label: 'Code' },
              { type: 'poll', icon: 'BarChart3', label: 'Poll' }
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setCreatePostType(type)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
                  createPostType === type 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon name={icon} size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content Input */}
          <textarea 
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />

          {/* Image Upload */}
          {createPostType === 'image' && (
            <div className="mt-4">
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label 
                htmlFor="imageUpload"
                className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Icon name="Image" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  Drop your photos here or click to browse
                </p>
                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block">
                  Choose Photos
                </span>
              </label>
              
              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {selectedImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="w-full aspect-[4/5] object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Upload */}
          {createPostType === 'video' && (
            <div className="mt-4">
              <input
                type="file"
                id="videoUpload"
                accept="video/*"
                className="hidden"
              />
              <label 
                htmlFor="videoUpload"
                className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Icon name="Video" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  Drop your video here or click to browse
                </p>
                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block">
                  Choose Video
                </span>
              </label>
            </div>
          )}

          {/* Code Editor */}
          {createPostType === 'code' && (
            <div className="mt-4">
              <textarea 
                placeholder="Paste your code here..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none font-mono text-sm bg-gray-50"
                rows="8"
              />
            </div>
          )}

          {/* Poll Creation */}
          {createPostType === 'poll' && (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Poll Options:</label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => removePollOption(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                {pollOptions.length < 6 && (
                  <button
                    onClick={addPollOption}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <Icon name="Plus" size={16} />
                    <span>Add Option</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button 
              onClick={() => {
                setShowCreateModal(false);
                setPostText('');
                setSelectedImages([]);
                setPollOptions(['', '']);
                setPollQuestion('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                // Here you would handle the post creation logic
                // Create new post with provided data
                const newPost = {
                  type: createPostType,
                  text: postText,
                  images: selectedImages,
                  poll: createPostType === 'poll' ? { question: pollQuestion, options: pollOptions } : null
                };
                setShowCreateModal(false);
                setPostText('');
                setSelectedImages([]);
                setPollOptions(['', '']);
                setPollQuestion('');
              }}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Sidebar with categories and sorting
  const Sidebar = () => (
    <div className="sticky top-20 space-y-4">
      {/* View Mode Toggle */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">View Mode</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setViewMode('social')}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'social' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon name="Instagram" size={20} />
              <span>Social</span>
            </div>
          </button>
          <button
            onClick={() => setViewMode('forum')}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'forum' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon name="MessageSquare" size={20} />
              <span>Forums</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Sort Posts</h3>
        <div className="space-y-2">
          {[
            { value: 'hot', label: 'Hot', desc: 'Most engaging' },
            { value: 'new', label: 'New', desc: 'Latest posts' },
            { value: 'top', label: 'Top', desc: 'Highest voted' }
          ].map((sort) => (
            <button
              key={sort.value}
              onClick={() => setSortBy(sort.value)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                sortBy === sort.value 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">{sort.label}</div>
              <div className="text-xs text-gray-500">{sort.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-1">
          {[
            { value: 'all', label: 'All Posts' },
            { value: 'Technical Help', label: 'Technical Help' },
            { value: 'Project Showcase', label: 'Projects' },
            { value: 'Tutorials', label: 'Tutorials' }
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`w-full text-left p-2 rounded text-sm transition-colors ${
                selectedCategory === category.value 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Twitter-style Forum View Component
  const ForumView = () => {
    const [newTweet, setNewTweet] = useState('');
    const [tweetLength, setTweetLength] = useState(0);
    const maxTweetLength = 280;

    const handleTweetSubmit = () => {
      if (newTweet.trim() && newTweet.length <= maxTweetLength) {
        // Submit new tweet
        setNewTweet('');
        setTweetLength(0);
      }
    };

    const handleTweetChange = (e) => {
      const text = e.target.value;
      setNewTweet(text);
      setTweetLength(text.length);
    };

    const openPost = (post) => {
      setSelectedPost(post);
      setShowPostModal(true);
    };

    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    };

    return (
      <div className="max-w-2xl mx-auto">
        {/* Tweet Composer */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
              👤
            </div>
            <div className="flex-1">
              <textarea
                value={newTweet}
                onChange={handleTweetChange}
                placeholder="What's happening in tech?"
                className="w-full p-3 text-xl border-none resize-none focus:outline-none placeholder-gray-500"
                rows="3"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
                    <Icon name="Image" size={20} />
                  </button>
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
                    <Icon name="MapPin" size={20} />
                  </button>
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
                    <Icon name="Smile" size={20} />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${tweetLength > maxTweetLength ? 'text-red-500' : 'text-gray-500'}`}>
                    {tweetLength}/{maxTweetLength}
                  </span>
                  <button
                    onClick={handleTweetSubmit}
                    disabled={!newTweet.trim() || tweetLength > maxTweetLength}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Twitter-style Feed */}
        <div className="space-y-0">
          {twitterStylePosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => openPost(post)}
            >
              <div className="flex space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                  {post.user.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-gray-900 truncate">{post.user.name}</span>
                    {post.user.verified && (
                      <Icon name="CheckCircle" size={16} className="text-blue-500 flex-shrink-0" />
                    )}
                    <span className="text-gray-500 truncate">{post.user.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">{post.timestamp}</span>
                  </div>

                  {/* Content */}
                  <div className="text-gray-900 mb-3 leading-relaxed">
                    {post.content.split('\n').map((line, index) => (
                      <div key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line.split(' ').map((word, wordIndex) => {
                          if (word.startsWith('#')) {
                            return (
                              <span key={wordIndex} className="text-blue-500 hover:underline cursor-pointer">
                                {word}{' '}
                              </span>
                            );
                          }
                          if (word.startsWith('@')) {
                            return (
                              <span key={wordIndex} className="text-blue-500 hover:underline cursor-pointer">
                                {word}{' '}
                              </span>
                            );
                          }
                          return word + ' ';
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between max-w-md">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle reply to post
                      }}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors"
                    >
                      <Icon name="MessageCircle" size={18} />
                      <span className="text-sm">{formatNumber(post.comments)}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle retweet post
                      }}
                      className={`flex items-center space-x-2 hover:bg-green-50 px-3 py-2 rounded-full transition-colors ${
                        post.isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                      }`}
                    >
                      <Icon name="Repeat" size={18} />
                      <span className="text-sm">{formatNumber(post.retweets)}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like post
                      }}
                      className={`flex items-center space-x-2 hover:bg-red-50 px-3 py-2 rounded-full transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Icon name="Heart" size={18} className={post.isLiked ? 'fill-current' : ''} />
                      <span className="text-sm">{formatNumber(post.likes)}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle share post
                      }}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors"
                    >
                      <Icon name="Share" size={18} />
                      <span className="text-sm">{post.views}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Post Detail Modal (Twitter-style)
  const PostDetailModal = () => {
    if (!showPostModal || !selectedPost) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Post</h2>
            <button 
              onClick={() => setShowPostModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Main Post */}
          <div className="p-6">
            <div className="flex space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                {selectedPost.user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold text-gray-900">{selectedPost.user.name}</span>
                  {selectedPost.user.verified && (
                    <Icon name="CheckCircle" size={16} className="text-blue-500" />
                  )}
                  <span className="text-gray-500">{selectedPost.user.username}</span>
                </div>
                <div className="text-gray-500 text-sm mb-3">{selectedPost.user.followers} followers</div>
              </div>
            </div>

            {/* Content */}
            <div className="text-xl text-gray-900 mb-4 leading-relaxed">
              {selectedPost.content.split('\n').map((line, index) => (
                <div key={index} className={index > 0 ? 'mt-2' : ''}>
                  {line.split(' ').map((word, wordIndex) => {
                    if (word.startsWith('#')) {
                      return (
                        <span key={wordIndex} className="text-blue-500 hover:underline cursor-pointer">
                          {word}{' '}
                        </span>
                      );
                    }
                    if (word.startsWith('@')) {
                      return (
                        <span key={wordIndex} className="text-blue-500 hover:underline cursor-pointer">
                          {word}{' '}
                        </span>
                      );
                    }
                    return word + ' ';
                  })}
                </div>
              ))}
            </div>

            {/* Timestamp and Views */}
            <div className="text-gray-500 text-sm mb-4 border-b border-gray-200 pb-4">
              {selectedPost.timestamp} · {selectedPost.views} views
            </div>

            {/* Action Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4 border-b border-gray-200 pb-4">
              <span><strong className="text-gray-900">{selectedPost.retweets}</strong> Reposts</span>
              <span><strong className="text-gray-900">{selectedPost.likes}</strong> Likes</span>
              <span><strong className="text-gray-900">{selectedPost.comments}</strong> Replies</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around mb-6 border-b border-gray-200 pb-4">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-full">
                <Icon name="MessageCircle" size={20} />
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 hover:bg-green-50 px-4 py-2 rounded-full">
                <Icon name="Repeat" size={20} />
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-full">
                <Icon name="Heart" size={20} />
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-full">
                <Icon name="Share" size={20} />
              </button>
            </div>

            {/* Reply Input */}
            <div className="flex space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                👤
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Post your reply"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-semibold">
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {selectedPost.replies && selectedPost.replies.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Replies</h3>
                {selectedPost.replies.map((reply) => (
                  <div key={reply.id} className="flex space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                      {reply.user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">{reply.user.name}</span>
                        {reply.user.verified && (
                          <Icon name="CheckCircle" size={14} className="text-blue-500" />
                        )}
                        <span className="text-gray-500 text-sm">{reply.user.username}</span>
                        <span className="text-gray-500 text-sm">· {reply.timestamp}</span>
                      </div>
                      <div className="text-gray-900">{reply.content}</div>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="text-gray-500 hover:text-blue-500 text-sm">
                          <Icon name="MessageCircle" size={14} className="inline mr-1" />
                          Reply
                        </button>
                        <button className="text-gray-500 hover:text-red-500 text-sm">
                          <Icon name="Heart" size={14} className="inline mr-1" />
                          {reply.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Campus Forums - CodeCampus</title>
        <meta name="description" content="Connect, share, and learn with the CodeCampus community" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-4 lg:px-6">
            {viewMode === 'social' ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Feed */}
                <div className="lg:col-span-3">
                  <div className="max-w-2xl mx-auto">
                    {/* Create Post */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                        👤
                      </div>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        What's on your mind, Aditya?
                      </button>
                      {/* Friend Request Button */}
                      <button 
                        onClick={() => setShowFriendRequests(true)}
                        className="relative p-2 text-gray-600 hover:text-gray-800"
                      >
                        <Icon name="Users" size={20} />
                        {friendRequests.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {friendRequests.length}
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-around mt-4 pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => { setCreatePostType('image'); setShowCreateModal(true); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Icon name="Image" size={20} className="text-green-500" />
                        <span className="text-sm text-gray-700">Photo</span>
                      </button>
                      <button 
                        onClick={() => { setCreatePostType('video'); setShowCreateModal(true); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Icon name="Video" size={20} className="text-red-500" />
                        <span className="text-sm text-gray-700">Video</span>
                      </button>
                      <button 
                        onClick={() => { setCreatePostType('code'); setShowCreateModal(true); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Icon name="Code" size={20} className="text-blue-500" />
                        <span className="text-sm text-gray-700">Code</span>
                      </button>
                      <button 
                        onClick={() => { setCreatePostType('poll'); setShowCreateModal(true); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Icon name="BarChart3" size={20} className="text-purple-500" />
                        <span className="text-sm text-gray-700">Poll</span>
                      </button>
                    </div>
                  </div>

                  {/* Posts Feed */}
                  <div>
                    {/* Feed Header */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <h2 className="font-semibold text-gray-900">
                            {selectedCategory === 'all' ? 'All Posts' : selectedCategory}
                          </h2>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {filteredAndSortedPosts.length} posts
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Icon name="TrendingUp" size={16} />
                          <span className="capitalize">{sortBy}</span>
                        </div>
                      </div>
                    </div>

                    {filteredAndSortedPosts.map((post) => (
                      <InstagramPost key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block">
                <Sidebar />
              </div>
            </div>
            ) : (
              /* Forum View */
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <ForumView />
                </div>
                <div className="hidden lg:block">
                  <Sidebar />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <FriendRequestsModal />
        <CreatePostModal />
        <PostDetailModal />
      </div>
    </>
  );
};

export default CampusForums;
