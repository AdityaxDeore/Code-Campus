import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { stats, codeExamples } from '../data/heroData';

const HeroSection = ({ 
  variant = 'homepage', // or 'about'
  className = '' 
}) => {
  const navigate = useNavigate();
  const [currentCode, setCurrentCode] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const themeClasses = {
    homepage: {
      section: 'bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      heading: 'text-gray-900 dark:text-white',
      text: 'text-gray-600 dark:text-gray-300',
      primary: 'text-blue-600 dark:text-blue-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
    },
    about: {
      section: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5',
      heading: 'text-foreground',
      text: 'text-muted-foreground',
      primary: 'text-primary',
      accent: 'text-secondary',
      badge: 'bg-primary/10 text-primary'
    }
  };

  const theme = themeClasses[variant];

  useEffect(() => {
    if (variant === 'homepage') {
      const currentExample = codeExamples?.[currentCode];
      let index = 0;
      setTypedText('');
      setIsTyping(true);

      const typeInterval = setInterval(() => {
        if (index < currentExample?.code?.length) {
          setTypedText(currentExample?.code?.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
          
          setTimeout(() => {
            setCurrentCode((prev) => (prev + 1) % codeExamples?.length);
          }, 3000);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [currentCode, variant]);

  const renderHomepageHero = () => (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-20 pt-24">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 z-10 relative"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center space-x-2 ${theme.badge} px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm`}
            >
              <Icon name="Sparkles" size={16} />
              <span>Join 12,000+ Students Coding Together</span>
            </motion.div>

            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold ${theme.heading} leading-tight`}
            >
              Your Code,
              <br />
              <span className={theme.primary}>Your Community,</span>
              <br />
              <span className={theme.accent}>Your Career</span>
            </motion.h4>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-lg sm:text-xl ${theme.text} leading-relaxed max-w-2xl`}
            >
              Transform your coding journey from individual struggle to collaborative success. 
              Build skills, showcase projects, and launch your tech career with your campus community.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {stats?.map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Icon name={stat?.icon} size={24} className={theme.primary} />
                  </div>
                </div>
                <div className={`text-2xl sm:text-3xl font-bold ${theme.heading}`}>{stat?.value}</div>
                <div className={`text-sm ${theme.text}`}>{stat?.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="default"
              size="lg"
              iconName="GraduationCap"
              iconPosition="left"
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-xl"
              onClick={() => navigate('/login')}
            >
              Join Your Campus
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconName="Code"
              iconPosition="left"
              className="flex-1 sm:flex-none border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => navigate('/problem-workspace')}
            >
              Explore Problems
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Content - Animated Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Terminal Header */}
            <div className="bg-gray-800 dark:bg-gray-900 px-4 py-3 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                  {codeExamples?.[currentCode]?.problem} - {codeExamples?.[currentCode]?.language}
                </span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 h-80 overflow-hidden">
              <pre className="text-green-400 dark:text-green-300 font-mono text-sm leading-relaxed">
                <code>{typedText}</code>
                {isTyping && <span className="animate-pulse">|</span>}
              </pre>
            </div>

            {/* Terminal Footer */}
            <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-xs">
                <Icon name="CheckCircle" size={14} className="text-green-500 dark:text-green-400" />
                <span>Solution Accepted</span>
              </div>
              <div className="flex space-x-4 text-gray-400 dark:text-gray-500 text-xs">
                <span>Runtime: 64ms</span>
                <span>Memory: 14.2MB</span>
              </div>
            </div>
          </div>

          {/* Floating Achievement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                <Icon name="Trophy" size={20} className={theme.accent} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${theme.heading}`}>Problem Solved!</div>
                <div className={`text-xs ${theme.text}`}>+50 XP earned</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const renderAboutHero = () => (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className={`inline-flex items-center space-x-2 ${theme.badge} px-4 py-2 rounded-full text-sm font-medium`}>
              <Icon name="Sparkles" size={16} />
              <span>Transforming Computer Science Education</span>
            </div>
            
            <h1 className={`text-4xl lg:text-6xl font-bold ${theme.heading} leading-tight`}>
              About{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CodeCampus
              </span>
            </h1>
            
            <p className={`text-xl ${theme.text} leading-relaxed`}>
              Where academic excellence meets collaborative innovation. We're bridging the gap between 
              computer science education and real-world career success through community-driven learning.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {stats.map((stat, index) => (
              <div key={index} className={`flex items-center space-x-2 ${theme.heading}`}>
                <div className={`w-2 h-2 ${index === 0 ? 'bg-secondary' : index === 1 ? 'bg-accent' : 'bg-primary'} rounded-full`}></div>
                <span className="text-sm font-medium">
                  {stat.label}: {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative bg-card rounded-2xl p-8 academic-shadow-lg">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Code" size={32} className="text-primary" />
            </div>
            
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
              alt="Students collaborating on coding projects"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme.heading}`}>
                Collaborative Learning Environment
              </h3>
              <p className={`${theme.text} text-sm`}>
                Students working together on real-world projects, sharing knowledge, and building lasting professional networks.
              </p>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg academic-shadow">
            <div className="flex items-center space-x-2">
              <Icon name="Trophy" size={16} />
              <span className="text-sm font-medium">Top Ranked Platform</span>
            </div>
          </div>
          
          <div className="absolute -top-6 -left-6 bg-accent text-accent-foreground px-4 py-2 rounded-lg academic-shadow">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span className="text-sm font-medium">Active Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`relative ${theme.section} ${variant === 'homepage' ? 'min-h-screen' : 'py-20 lg:py-32'} w-full flex items-center overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${variant === 'homepage' ? 'bg-grid-pattern opacity-5 dark:opacity-10' : 'bg-gradient-mesh opacity-5'}`}></div>
      
      {/* Floating Elements */}
      {variant === 'homepage' && (
        <>
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </>
      )}
      
      {variant === 'homepage' ? renderHomepageHero() : renderAboutHero()}
    </section>
  );
};

export default HeroSection;
