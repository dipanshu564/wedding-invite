/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Music, 
  Volume2, 
  VolumeX, 
  ChevronDown,
  Clock,
  Camera,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useInView } from 'react-intersection-observer';
import { cn } from './lib/utils';

// --- Components ---

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute w-1 h-1 rounded-full",
            i % 3 === 0 ? "bg-red-500/50" : "bg-gold-metallic/30"
          )}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0 
          }}
          animate={{ 
            y: ["-10%", "110%"],
            opacity: [0, 0.6, 0],
            x: (Math.random() - 0.5) * 200 + "px"
          }}
          transition={{ 
            duration: 15 + Math.random() * 25, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
};

const ThreeDCard = ({ children, className }: { children: React.ReactNode, className?: string, key?: React.Key }) => {
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 20;
    const yPct = (mouseY / height - 0.5) * -20;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY: x, rotateX: y, transformStyle: "preserve-3d" }}
      className={cn("perspective-1000", className)}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const FlyingFlowers = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: "-10%",
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0 
          }}
          animate={{ 
            y: "110%",
            x: (Math.random() * 100 + (Math.random() - 0.5) * 40) + "%",
            rotate: Math.random() * 1080,
            opacity: [0, 0.4, 0]
          }}
          transition={{ 
            duration: 25 + Math.random() * 30, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 20
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gold-metallic/15">
            <path d="M12 2C12 2 14 8 18 8C22 8 22 12 18 12C14 12 12 18 12 18C12 18 10 12 6 12C2 12 2 8 6 8C10 8 12 2 12 2Z" fill="currentColor" />
            <path d="M12 5C12 5 13 8 15 8C17 8 17 10 15 10C13 10 12 13 12 13C12 13 11 10 9 10C7 10 7 8 9 8C11 8 12 5 12 5Z" fill="currentColor" opacity="0.5" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const LoveEmojiEffect = ({ isInvitationOpen }: { isInvitationOpen: boolean }) => {
  const emojis = ['❤️', '🌹', '❣️', '💌', '🎈', '❤️', '💖', '💝', '💋', '🏩', '💒'];
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {[...Array(isInvitationOpen ? 40 : 25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: isInvitationOpen ? "-10%" : "110%",
            opacity: 0,
            scale: 0.5
          }}
          animate={{ 
            y: isInvitationOpen ? "110%" : "-10%",
            x: (Math.random() * 100 + (Math.random() - 0.5) * 20) + "%",
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.2, 0.8],
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 10 + Math.random() * 15, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 15
          }}
        >
          {emojis[i % emojis.length]}
        </motion.div>
      ))}
    </div>
  );
};

const DesktopNav = ({ isInvitationOpen }: { isInvitationOpen: boolean }) => {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Couple', href: '#couple' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Venue', href: '#venue' },
    { name: 'Blessings', href: '#blessings' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isInvitationOpen && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center p-6"
        >
          <div className="glass px-8 py-3 rounded-full border-gold-metallic/20 flex gap-8 items-center">
            <span className="text-gold-metallic font-script text-2xl mr-4">H & A</span>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs uppercase tracking-[0.2em] text-gold-soft/70 hover:text-gold-metallic transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

const MobileNav = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) => {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Couple', href: '#couple' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Venue', href: '#venue' },
    { name: 'Blessings', href: '#blessings' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-royal-navy/80 backdrop-blur-sm z-[100] md:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-midnight z-[101] md:hidden border-l border-gold-metallic/20 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-script text-gold-metallic">H & A</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-gold-metallic border-gold-metallic/30"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-serif text-gold-soft hover:text-gold-metallic transition-colors tracking-widest"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto pt-8 border-t border-gold-metallic/10 text-center">
              <Heart className="text-gold-metallic w-6 h-6 mx-auto mb-4 animate-pulse" />
              <p className="text-gold-soft/40 text-xs font-sans tracking-[0.2em] uppercase">
                April 21, 2026
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CursorGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (Math.random() > 0.8) {
        const id = Date.now();
        setSparkles(prev => [...prev.slice(-10), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id));
        }, 800);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.group');
      
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        animate={{
          x: mousePos.x - (isHovering ? 32 : 16),
          y: mousePos.y - (isHovering ? 32 : 16),
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(212, 175, 55, 0.3)" : "rgba(212, 175, 55, 0.15)",
          boxShadow: isHovering 
            ? "0 0 40px 20px rgba(212, 175, 55, 0.4)" 
            : "0 0 20px 10px rgba(212, 175, 55, 0.2)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
      />
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: 20 }}
          className="fixed w-1 h-1 bg-gold-metallic rounded-full pointer-events-none z-[9998]"
          style={{ left: sparkle.x, top: sparkle.y }}
        />
      ))}
    </>
  );
};

const HeartBurst = () => {
  const [bursts, setBursts] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {bursts.map(burst => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl"
                initial={{ x: 0, y: 0 }}
                animate={{ 
                  x: Math.cos(i * 45 * Math.PI / 180) * 100,
                  y: Math.sin(i * 45 * Math.PI / 180) * 100,
                  rotate: Math.random() * 360
                }}
              >
                ❤️
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const SectionHeading = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={cn("text-center mb-16", className)}
    >
      {subtitle && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gold-metallic font-serif italic text-lg mb-2 block tracking-widest uppercase"
        >
          {subtitle}
        </motion.span>
      )}
      <div className="relative inline-block">
        <h2 className="text-4xl md:text-6xl font-serif text-gold-metallic gold-border-glow px-12 py-4 relative">
          <motion.span 
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring" }}
            className="absolute -left-2 top-1/2 -translate-y-1/2 text-2xl md:text-3xl"
          >
            ❤️
          </motion.span>
          {title}
          <motion.span 
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring" }}
            className="absolute -right-2 top-1/2 -translate-y-1/2 text-2xl md:text-3xl"
          >
            ❤️
          </motion.span>
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : {}}
          transition={{ delay: 0.6, duration: 1 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent absolute bottom-0 left-0"
        />
        <motion.div 
          initial={{ height: 0 }}
          animate={inView ? { height: "100%" } : {}}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-[1px] bg-gradient-to-b from-transparent via-gold-metallic to-transparent absolute top-0 left-0"
        />
        <motion.div 
          initial={{ height: 0 }}
          animate={inView ? { height: "100%" } : {}}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-[1px] bg-gradient-to-b from-transparent via-gold-metallic to-transparent absolute top-0 right-0"
        />
      </div>
    </motion.div>
  );
};

const CountdownItem = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-20 h-24 md:w-28 md:h-32 glass rounded-xl flex items-center justify-center mb-2 overflow-hidden border-gold-metallic/30">
      <div className="absolute inset-0 bg-gold-metallic/5" />
      <motion.span 
        key={value}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-serif text-gold-metallic z-10"
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold-metallic/20" />
    </div>
    <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-gold-soft/70 font-sans flex items-center gap-2">
      <span className="text-[10px] animate-pulse">❤️</span>
      {label}
      <span className="text-[10px] animate-pulse">❤️</span>
    </span>
  </div>
);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const parallaxY = useSpring(useSpring(scrollYProgress, { stiffness: 100, damping: 30 }), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const weddingDate = new Date('2026-04-21T20:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
    
    // Royal Gold & Red Love Confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#FF0000'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#FF0000'] });
    }, 250);

    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E6C97A', '#E8DCCB', '#FFFFFF', '#FF0000'],
      shapes: ['circle', 'square'],
      scalar: 1.2
    });

    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-royal-navy flex flex-col items-center justify-center z-[100]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 border-2 border-gold-metallic/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-script text-gold-metallic">H & A</span>
          </div>
        </motion.div>
        <motion.div 
          className="mt-8 h-1 w-48 bg-gold-metallic/10 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: 192 }}
          transition={{ duration: 2 }}
        >
          <motion.div 
            className="h-full bg-gold-metallic"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <p className="mt-4 text-gold-soft/60 font-serif italic tracking-widest">Preparing the Royal Experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-gold-metallic/30 bg-royal-navy text-champagne font-sans mughal-pattern">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gold-metallic z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <CursorGlow />
      <FloatingParticles />
      <FlyingFlowers />
      <LoveEmojiEffect isInvitationOpen={isInvitationOpen} />
      <HeartBurst />
      <DesktopNav isInvitationOpen={isInvitationOpen} />
      <MobileNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      
      {/* Mobile Menu Toggle */}
      <AnimatePresence mode="wait">
        {isInvitationOpen && (
          <motion.button
            key="menu-toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsNavOpen(true)}
            className="fixed top-6 right-6 z-[60] w-12 h-12 glass rounded-full flex items-center justify-center text-gold-metallic border-gold-metallic/30 md:hidden"
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Background Audio */}
      <audio 
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop 
      />

      <AnimatePresence>
        {!isInvitationOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, rotateX: 90 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-royal-navy perspective-1000"
          >
            <div className="absolute inset-0 mughal-pattern opacity-10" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative text-center px-6 max-w-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="mb-8"
                style={{ transform: "translateZ(50px)" }}
              >
                <div className="w-24 h-24 mx-auto border border-gold-metallic/30 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl animate-pulse">❤️</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-script text-gold-metallic mb-4 text-glow-gold shimmer-text">
                  Himanshu & Akanksha
                </h1>
                <p className="text-gold-soft font-serif italic text-xl mb-12 tracking-widest flex items-center justify-center gap-2">
                  <span className="text-sm">❤️</span>
                  Are getting married
                  <span className="text-sm">❤️</span>
                </p>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)", translateZ: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="shine-sweep px-10 py-4 glass text-gold-metallic border-gold-metallic/50 rounded-full font-serif tracking-[0.3em] uppercase text-sm transition-all duration-500 hover:bg-gold-metallic hover:text-royal-navy"
                style={{ transform: "translateZ(30px)" }}
              >
                Open Invitation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn("transition-all duration-1000", !isInvitationOpen && "blur-md pointer-events-none")}>
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden perspective-1000">
          <div className="absolute inset-0 bg-radial-gradient from-gold-metallic/5 via-transparent to-transparent opacity-30" />
          
          {/* 3D Parallax Background Elements */}
          <motion.div 
            style={{ 
              y: parallaxY,
              translateZ: -100 
            }}
            className="absolute inset-0 mughal-pattern opacity-10 pointer-events-none" 
          />

          <div className="relative z-10 text-center px-6" style={{ transformStyle: "preserve-3d" }}>
            <motion.div
              initial={{ opacity: 0, z: -100 }}
              whileInView={{ opacity: 1, z: 0 }}
              transition={{ duration: 1.5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-gold-soft font-serif italic text-lg md:text-xl mb-6 block tracking-[0.2em]"
                style={{ transform: "translateZ(20px)" }}
              >
                Together with their families
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-6xl md:text-9xl font-script text-gold-metallic mb-8 text-glow-gold flex items-center justify-center gap-4 flex-wrap"
                style={{ transform: "translateZ(100px)" }}
              >
                <span className="text-4xl md:text-6xl animate-pulse">❤️</span>
                Himanshu & Akanksha
                <span className="text-4xl md:text-6xl animate-pulse">❤️</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col items-center"
                style={{ transform: "translateZ(40px)" }}
              >
                <p className="text-gold-soft/80 font-serif text-lg md:text-2xl mb-8 tracking-[0.15em]">
                  Request the pleasure of your company
                </p>
                
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-[1px] w-12 bg-gold-metallic/30" />
                  <span className="text-gold-metallic font-serif text-xl md:text-2xl tracking-widest">
                    April 21, 2026 • Agra
                  </span>
                  <div className="h-[1px] w-12 bg-gold-metallic/30" />
                </div>
                
                <motion.p 
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-gold-metallic font-serif italic text-lg tracking-[0.3em] uppercase shimmer-text"
                >
                  Two Souls, One Heart
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-metallic/40"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* Couple Section */}
        <section id="couple" className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="The Couple" subtitle="A Journey of Love" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-linear-to-r from-transparent via-gold-metallic/30 to-transparent z-0" />
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full items-center justify-center z-10 border-gold-metallic/30">
                <Heart className="text-gold-metallic w-6 h-6 fill-gold-metallic/20" />
              </div>

              {/* Groom */}
              <ThreeDCard className="w-full">
                <div className="glass-card p-8 rounded-3xl text-center group transition-all duration-500 hover:border-gold-metallic/50">
                  <div className="relative w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden border-2 border-gold-metallic/30 p-2">
                    <div className="absolute inset-0 bg-gold-metallic/10 animate-pulse" />
                    <img 
                      src="/images/Himanshu.jpg.jpeg" 
                      alt="Himanshu" 
                      className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-3xl font-serif text-gold-metallic mb-4">Himanshu</h3>
                  <p className="text-gold-soft/70 font-serif italic leading-relaxed">
                    ❤️ "A devoted soul with an adventurous spirit, ready to build a lifetime of memories with his best friend." ❤️
                  </p>
                </div>
              </ThreeDCard>

              {/* Bride */}
              <ThreeDCard className="w-full">
                <div className="glass-card p-8 rounded-3xl text-center group transition-all duration-500 hover:border-gold-metallic/50">
                  <div className="relative w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden border-2 border-gold-metallic/30 p-2">
                    <div className="absolute inset-0 bg-gold-metallic/10 animate-pulse" />
                    <img 
                      src="/images/Akanksha.jpg.jpeg" 
                      alt="Akanksha" 
                      className="w-full h-full object-contain rounded-full grayscale hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-3xl font-serif text-gold-metallic mb-4">Akanksha</h3>
                  <p className="text-gold-soft/70 font-serif italic leading-relaxed">
                    ❤️ "A dreamer with a heart full of love, finding her forever in every shared smile and quiet moment." ❤️
                  </p>
                </div>
              </ThreeDCard>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-24 px-6 bg-midnight/30 relative">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title="Wedding Functions" subtitle="The Celebration" />
            
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gold-metallic/40 to-transparent" />
              
              {[
                { date: "15 April", title: "Tilak & Sagai", desc: "The official beginning of our journey together." },
                { date: "19 April", title: "Mehndi", desc: "A day filled with henna, music, and laughter." },
                { date: "20 April", title: "Haldi & Sangeet", desc: "Colors of joy followed by a night of dance." },
                { date: "21 April", title: "Wedding & Vidaai", desc: "The sacred union and a new beginning." }
              ].map((event, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={cn(
                    "relative flex items-center mb-16 pl-12 md:pl-0",
                    i % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  )}
                >
                  <div className={cn(
                    "w-full md:w-[45%] glass-card p-6 rounded-2xl relative text-left transition-all duration-500 hover:border-gold-metallic/60",
                    i % 2 === 0 ? "md:text-right" : "md:text-left"
                  )}>
                    <span className="text-gold-metallic font-serif text-lg mb-2 block tracking-wider">{event.date}</span>
                    <h4 className="text-2xl font-serif text-champagne mb-2">{event.title}</h4>
                    <p className="text-gold-soft/60 text-sm italic leading-relaxed">{event.desc}</p>
                  </div>
                  
                  {/* Mandala Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 glass rounded-full border-gold-metallic/50 flex items-center justify-center bg-royal-navy z-10 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <span className="text-sm animate-pulse">❤️</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="The Events" subtitle="Save the Dates" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Mehndi", date: "April 19, 2026", time: "4:00 PM", venue: "Silaudi" },
                { name: "Haldi", date: "April 20, 2026", time: "10:00 AM", venue: "Silaudi" },
                { name: "Sangeet", date: "April 20, 2026", time: "7:00 PM", venue: "Silaudi" },
                { name: "Wedding", date: "April 21, 2026", time: "8:00 PM", venue: "Silaudi" }
              ].map((event, i) => (
                <ThreeDCard key={i} className="w-full">
                  <div className="glass-card p-8 rounded-2xl text-center border-gold-metallic/20 shine-sweep group h-full">
                    <div className="w-16 h-16 mx-auto mb-6 glass rounded-full flex items-center justify-center border-gold-metallic/30 group-hover:border-gold-metallic transition-colors">
                      <span className="text-2xl animate-bounce">❤️</span>
                    </div>
                    <h3 className="text-2xl font-serif text-gold-metallic mb-4">{event.name}</h3>
                    <div className="space-y-2 text-gold-soft/70 font-serif italic">
                      <p>{event.date}</p>
                      <p>{event.time}</p>
                      <p className="text-gold-metallic mt-4 not-italic font-sans tracking-widest uppercase text-xs">{event.venue}</p>
                    </div>
                  </div>
                </ThreeDCard>
              ))}
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-24 px-6 bg-midnight/50 relative overflow-hidden">
          <div className="absolute inset-0 mughal-pattern opacity-5" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <SectionHeading title="Counting the Days" subtitle="The Big Day" className="mb-12" />
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <CountdownItem value={timeLeft.days} label="Days" />
              <CountdownItem value={timeLeft.hours} label="Hours" />
              <CountdownItem value={timeLeft.minutes} label="Minutes" />
              <CountdownItem value={timeLeft.seconds} label="Seconds" />
            </div>
            
            <div className="mt-16 flex justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-gold-metallic/20 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border border-gold-metallic/30 rounded-full"
                />
                <Heart className="text-gold-metallic w-12 h-12 fill-gold-metallic/10 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="Our Moments" subtitle="Captured Memories" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 perspective-1000">
              {[
                "/images/Akanksha.jpg.jpeg",
                "/images/Himanshu.jpg.jpeg", 
                "/images/Rajan_dada_3.jpeg",
                "/images/Rajan_data_4.jpeg",
                "/images/WhatsApp_Image_2026-03-28_at_11.42.25_AM_1.jpeg",
                "/images/Akanksha.jpg.jpeg",
                "/images/Himanshu.jpg.jpeg",
                "/images/Rajan_dada_3.jpeg"
              ].map((imageSrc, index) => (
                <motion.div
                  key={index}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square rounded-2xl cursor-pointer group"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-gold-metallic/10">
                    <img 
                      src={imageSrc} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-2xl bg-midnight border border-gold-metallic/30 flex flex-col items-center justify-center p-4 text-center"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <Heart className="text-gold-metallic w-6 h-6 mb-2" />
                    <p className="text-gold-soft/80 font-serif italic text-xs md:text-sm">
                      "A beautiful memory from our journey together."
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section id="venue" className="py-24 px-6 bg-midnight/30 relative">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading title="Wedding Venue" subtitle="Join Us At" />
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-12 rounded-3xl border-gold-metallic/30 relative overflow-hidden group perspective-1000"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <MapPin size={120} className="text-gold-metallic" />
              </div>
              
              <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-20 h-20 mx-auto mb-8 glass rounded-full flex items-center justify-center border-gold-metallic/40" style={{ transform: "translateZ(50px)" }}>
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotateY: [0, 360, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <MapPin className="text-gold-metallic w-10 h-10" />
                  </motion.div>
                </div>
                
                <h3 className="text-3xl font-serif text-gold-metallic mb-4" style={{ transform: "translateZ(30px)" }}>Agra, Uttar Pradesh</h3>
                <p className="text-gold-soft/70 font-serif italic text-lg mb-8 max-w-md mx-auto" style={{ transform: "translateZ(20px)" }}>
                  The historic city of love, where we begin our forever.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 mx-auto px-8 py-3 glass text-gold-metallic border-gold-metallic/40 rounded-full font-serif tracking-widest uppercase text-xs transition-all hover:bg-gold-metallic hover:text-royal-navy"
                  style={{ transform: "translateZ(40px)" }}
                >
                  Get Directions <ExternalLink size={14} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blessings Section */}
        <section id="blessings" className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading 
              title="Send Your Blessings" 
              subtitle="Bless the Couple" 
            />
            <div className="glass-card p-12 rounded-3xl border-gold-metallic/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gold-metallic/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-2xl font-serif text-gold-metallic mb-8 italic">
                "Your love and blessings are the greatest gift we could receive."
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { icon: "❤️", label: "Love" },
                  { icon: "🙏", label: "Blessings" },
                  { icon: "✨", label: "Happiness" }
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      confetti({
                        particleCount: 40,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: ['#D4AF37', '#FF0000']
                      });
                    }}
                    className="flex flex-col items-center gap-2 px-6 py-4 glass rounded-2xl border-gold-metallic/30 hover:border-gold-metallic transition-all"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs uppercase tracking-widest text-gold-soft/70">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 mughal-pattern opacity-5" />
          <div className="max-w-2xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-2xl animate-pulse">❤️</span>
                <span className="text-2xl animate-pulse delay-75">🌹</span>
                <span className="text-2xl animate-pulse delay-150">❤️</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-script text-gold-metallic mb-6">Thank You</h2>
              <p className="text-gold-soft/60 font-serif italic text-lg mb-12 tracking-widest">
                For being part of our beautiful journey
              </p>
              
              <div className="h-[1px] w-32 bg-gold-metallic/30 mx-auto mb-8" />
              
              <p className="text-gold-metallic font-serif text-xl tracking-[0.2em] uppercase flex items-center justify-center gap-3">
                <span className="text-sm">❤️</span>
                Himanshu & Akanksha
                <span className="text-sm">❤️</span>
              </p>
              <p className="text-gold-soft/40 text-sm mt-4 font-sans tracking-[0.3em]">
                APRIL 21, 2026
              </p>
              
              <div className="mt-12 pt-8 border-t border-gold-metallic/10">
                <p className="text-gold-soft/30 text-[10px] uppercase tracking-[0.5em] font-sans">
                  Designed by <span className="text-gold-metallic/50 font-medium">DIPANSHU CHATURVEDI</span>
                </p>
              </div>
            </motion.div>
          </div>
        </footer>
      </main>

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 z-[70] flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className={cn(
            "w-12 h-12 glass rounded-full flex items-center justify-center transition-all duration-500",
            isPlaying ? "border-gold-metallic shadow-[0_0_15px_rgba(212, 175, 55, 0.4)]" : "border-gold-metallic/30"
          )}
        >
          {isPlaying ? (
            <div className="flex items-center gap-[2px]">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-gold-metallic rounded-full"
                />
              ))}
            </div>
          ) : (
            <VolumeX className="text-gold-metallic w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default App;
