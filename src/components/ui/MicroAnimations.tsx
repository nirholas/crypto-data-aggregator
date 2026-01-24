/**
 * @fileoverview Micro-Animation Components
 * 
 * Delightful micro-interactions and animated elements
 * for premium user experience.
 * 
 * @module components/ui/MicroAnimations
 */
'use client';

import { ReactNode, useState, useEffect } from 'react';

// Animated Counter - for displaying changing numbers
export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + difference * eased);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, duration]);

  return (
    <span className={`number-mono counter-animate ${className}`}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}

// Typing Text Animation
export interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  className = '',
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span 
          className={`inline-block w-0.5 h-[1.1em] bg-primary ml-0.5 ${isComplete ? 'animate-pulse' : ''}`}
        />
      )}
    </span>
  );
}

// Fade Stagger - animates children with staggered delays
export interface FadeStaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function FadeStagger({
  children,
  staggerDelay = 100,
  className = '',
}: FadeStaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-slide-up-fade"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Ripple Effect for buttons/cards
export interface RippleProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Ripple({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  className = '',
}: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-[ripple_0.6s_ease-out]"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            paddingBottom: '200%',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Floating Element - gentle floating animation
export interface FloatProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function Float({
  children,
  duration = 3,
  distance = 10,
  className = '',
}: FloatProps) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        '--float-distance': `${distance}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// Shake Animation - for errors/attention
export interface ShakeProps {
  children: ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Shake({
  children,
  trigger = false,
  className = '',
}: ShakeProps) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShaking(true);
      const timeout = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  return (
    <div className={`${shaking ? 'animate-shake' : ''} ${className}`}>
      {children}
    </div>
  );
}

// Pulse Glow - attention-grabbing glow animation
export interface PulseGlowProps {
  children: ReactNode;
  color?: 'primary' | 'gain' | 'loss' | 'warning';
  active?: boolean;
  className?: string;
}

const glowColors = {
  primary: 'shadow-[0_0_20px_rgba(56,97,251,0.5)]',
  gain: 'shadow-[0_0_20px_rgba(22,199,132,0.5)]',
  loss: 'shadow-[0_0_20px_rgba(234,57,67,0.5)]',
  warning: 'shadow-[0_0_20px_rgba(247,147,26,0.5)]',
};

export function PulseGlow({
  children,
  color = 'primary',
  active = true,
  className = '',
}: PulseGlowProps) {
  return (
    <div 
      className={`
        ${active ? `animate-glow-pulse ${glowColors[color]}` : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Price Flash - flash effect for price changes
export interface PriceFlashProps {
  children: ReactNode;
  direction?: 'up' | 'down' | null;
  className?: string;
}

export function PriceFlash({
  children,
  direction,
  className = '',
}: PriceFlashProps) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (direction) {
      setFlash(direction);
      const timeout = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timeout);
    }
  }, [direction]);

  return (
    <span
      className={`
        transition-colors duration-500
        ${flash === 'up' ? 'price-flash-up' : ''}
        ${flash === 'down' ? 'price-flash-down' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Confetti - celebration effect
export function Confetti({ trigger = false }: { trigger?: boolean }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (trigger) {
      const colors = ['#3861FB', '#16C784', '#818CF8', '#F7931A', '#EA3943'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animation: `confetti-fall 2.5s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
