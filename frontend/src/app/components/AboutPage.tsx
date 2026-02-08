import { motion } from 'framer-motion';
import { Terminal, Coffee, Music, Network, Brain, Cpu, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AboutPage() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const fullCommand = '> cat ~/aboutme.txt';

  // Typing animation
  useEffect(() => {
    if (typedText.length < fullCommand.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullCommand.slice(0, typedText.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      // Typing complete, wait a moment then show content
      const timeout = setTimeout(() => {
        setTypingComplete(true);
        setTimeout(() => setContentVisible(true), 200);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const contentContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground py-20 px-4 sm:px-6 lg:px-8">
      {/* Terminal Intro */}
      <motion.div
        className="max-w-7xl mx-auto mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-mono text-lg sm:text-xl text-foreground">
          <span className="text-green-500">$</span> {typedText}
          {!typingComplete && showCursor && (
            <span className="text-foreground">█</span>
          )}
        </div>
      </motion.div>

      {/* Main Content - Only visible after typing complete */}
      {contentVisible && (
        <motion.div
          className="max-w-7xl mx-auto"
          variants={contentContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section 1: Who I Am - Text Left | Visual Right */}
          <motion.section
            variants={sectionVariants}
            className="mb-32 relative"
            onHoverStart={() => setHoveredSection('section1')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="lg:col-span-7 relative group">
                {/* Glass Container */}
                <div className="bg-black/75 backdrop-blur-md rounded-lg p-8 relative">
                  {/* Red Line Accent */}
                  <motion.div
                    className="absolute -left-4 top-0 bottom-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: hoveredSection === 'section1' ? 1 : 0,
                      opacity: hoveredSection === 'section1' ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                    // 01_WHO_I_AM
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-3 mb-6 text-red-500">
                    Who I Am
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                    I'm a forever learner with a deep curiosity for how systems work—especially when they're complex, interconnected, and slightly chaotic. I use Arch Linux by choice, not by accident. I'm comfortable at the network level, and I like knowing that I can connect to, control, and manage my devices from anywhere, at any time. Digital control gives me peace of mind.
                  </p>
                </div>
              </div>

              {/* Visual Anchor */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative">
                  <div className="text-[12rem] sm:text-[16rem] font-bold text-border/20 select-none leading-none">
                    01
                  </div>
                  <Network className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 text-foreground/30" strokeWidth={1} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 2: How I Work - Visual Left | Text Right */}
          <motion.section
            variants={sectionVariants}
            className="mb-32 relative"
            onHoverStart={() => setHoveredSection('section2')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Visual Anchor */}
              <div className="lg:col-span-5 flex items-center justify-center order-2 lg:order-1">
                <div className="relative">
                  <div className="text-[12rem] sm:text-[16rem] font-bold text-border/20 select-none leading-none">
                    02
                  </div>
                  <Cpu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 text-foreground/30" strokeWidth={1} />
                </div>
              </div>

              {/* Text Content */}
              <div className="lg:col-span-7 relative group order-1 lg:order-2">
                {/* Glass Container */}
                <div className="bg-black/75 backdrop-blur-md rounded-lg p-8 relative">
                  {/* Red Line Accent */}
                  <motion.div
                    className="absolute -right-4 top-0 bottom-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: hoveredSection === 'section2' ? 1 : 0,
                      opacity: hoveredSection === 'section2' ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                    // 02_HOW_I_WORK
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-3 mb-6 text-red-500">
                    How I Work
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                    My ideal working environment is simple and ritualistic: music playing, coffee nearby, and a terminal always open.
                    I care deeply about privacy and security, not as buzzwords, but as design principles. I like my digital world structured, predictable, and intentional—even if real life doesn't always follow the same rules.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Engineering Mindset - Text Left | Visual Right */}
          <motion.section
            variants={sectionVariants}
            className="mb-32 relative"
            onHoverStart={() => setHoveredSection('section3')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="lg:col-span-7 relative group">
                {/* Glass Container */}
                <div className="bg-black/75 backdrop-blur-md rounded-lg p-8 relative">
                  {/* Red Line Accent */}
                  <motion.div
                    className="absolute -left-4 top-0 bottom-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: hoveredSection === 'section3' ? 1 : 0,
                      opacity: hoveredSection === 'section3' ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                    // 03_ENGINEERING_MINDSET
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-3 mb-6 text-red-500">
                    Engineering Mindset
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                    For me, software development is less about 'coding' and more about engineering: breaking problems down, designing systems, and thinking in flows, dependencies, and edge cases.
                    Building a project feels the same as playing a strategy game—every decision has long-term consequences, and good planning always beats brute force.
                  </p>
                </div>
              </div>

              {/* Visual Anchor */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative">
                  <div className="text-[12rem] sm:text-[16rem] font-bold text-border/20 select-none leading-none">
                    03
                  </div>
                  <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 text-foreground/30" strokeWidth={1} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 4: A Small Contradiction - Visual Left | Text Right */}
          <motion.section
            variants={sectionVariants}
            className="mb-32 relative"
            onHoverStart={() => setHoveredSection('section4')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Visual Anchor */}
              <div className="lg:col-span-5 flex items-center justify-center order-2 lg:order-1">
                <div className="relative">
                  <div className="text-[12rem] sm:text-[16rem] font-bold text-border/20 select-none leading-none">
                    04
                  </div>
                  <Layers className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 text-foreground/30" strokeWidth={1} />
                </div>
              </div>

              {/* Text Content */}
              <div className="lg:col-span-7 relative group order-1 lg:order-2">
                {/* Glass Container */}
                <div className="bg-black/75 backdrop-blur-md rounded-lg p-8 relative">
                  {/* Red Line Accent */}
                  <motion.div
                    className="absolute -right-4 top-0 bottom-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: hoveredSection === 'section4' ? 1 : 0,
                      opacity: hoveredSection === 'section4' ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                    // 04_CONTRADICTION
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-3 mb-6 text-red-500">
                    A Small Contradiction
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                      Digitally, I'm organized and methodical. Personally? A bit chaotic.
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground/70 italic">
                      I probably fit the classic engineer stereotype more than I'd like to admit—and I'm fine with that.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 5: Beyond Work - Text Left | Visual Right */}
          <motion.section
            variants={sectionVariants}
            className="mb-32 relative"
            onHoverStart={() => setHoveredSection('section5')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="lg:col-span-7 relative group">
                {/* Glass Container */}
                <div className="bg-black/75 backdrop-blur-md rounded-lg p-8 relative">
                  {/* Red Line Accent */}
                  <motion.div
                    className="absolute -left-4 top-0 bottom-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: hoveredSection === 'section5' ? 1 : 0,
                      opacity: hoveredSection === 'section5' ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                    // 05_BEYOND_WORK
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-3 mb-6 text-red-500">
                    Beyond Work
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                    I enjoy gaming, especially games that reward thinking, planning, and adaptation. They scratch the same itch as system design and problem-solving: understanding rules, exploiting mechanics, and finding elegant solutions.
                  </p>
                </div>
              </div>

              {/* Visual Anchor */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative">
                  <div className="text-[12rem] sm:text-[16rem] font-bold text-border/20 select-none leading-none">
                    05
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* The Rituals - Bottom Section with 100% Opaque Backgrounds */}
          <motion.section
            variants={sectionVariants}
            className="mt-40 pt-16 border-t border-border"
          >
            <div className="text-center mb-12">
              <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                // THE_RITUALS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <motion.div
                className="flex flex-col items-center gap-4 group cursor-default bg-card border border-border rounded-lg p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Music className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                </motion.div>
                <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                  Music
                </span>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-4 group cursor-default bg-card border border-border rounded-lg p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Coffee className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                </motion.div>
                <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                  Coffee
                </span>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-4 group cursor-default bg-card border border-border rounded-lg p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Terminal className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                </motion.div>
                <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                  Terminal
                </span>
              </motion.div>
            </div>
          </motion.section>

        </motion.div>
      )}
    </div>
  );
}
