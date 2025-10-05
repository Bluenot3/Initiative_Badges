
import React, { useState, useRef, useEffect, useCallback } from 'react';
import SceneBackdrop3D from './SceneBackdrop3D';
import CardBack from './CardBack';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Badge } from '../types';

declare const anime: any;

interface BadgeCardProps {
    badge: Badge;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    
    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const node = cardRef.current;
        if (node) {
            observerRef.current = new IntersectionObserver(
                ([entry]) => setIsIntersecting(entry.isIntersecting),
                { threshold: 0.1 }
            );
            observerRef.current.observe(node);
            return () => observerRef.current?.disconnect();
        }
    }, []);

    const handleFlip = useCallback(() => {
        if (!innerRef.current) return;
        const newFlippedState = !isFlipped;
        setIsFlipped(newFlippedState); // Set state immediately for ARIA attributes

        if (prefersReducedMotion) return;

        anime.timeline({
            easing: 'spring(1, 90, 12, 0)',
            duration: 800
        }).add({
            targets: innerRef.current,
            rotateY: newFlippedState ? 180 : 0,
            scale: [
                { value: 0.98, duration: 400 },
                { value: 1, duration: 400 }
            ],
        });
    }, [isFlipped, prefersReducedMotion]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        const rotateX = ((y / height) - 0.5) * -12;
        const rotateY = ((x / width) - 0.5) * 12;
        
        cardRef.current.style.setProperty('--mx', `${x}px`);
        cardRef.current.style.setProperty('--my', `${y}px`);

        anime({
            targets: cardRef.current,
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.03,
            duration: 400,
            easing: 'easeOutExpo'
        });
    };
    
    const handleMouseLeave = () => {
        if (prefersReducedMotion) return;
        anime({
            targets: cardRef.current,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 600,
            easing: 'easeOutExpo'
        });
    };

    return (
        <div
            ref={cardRef}
            className="card relative w-full aspect-[3/4.2] rounded-md transition-transform duration-300"
            style={{ 
                transformStyle: 'preserve-3d', 
                '--mx': '50%', '--my': '50%' 
            } as React.CSSProperties}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleFlip}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isFlipped}
            aria-label={`Initiative: ${badge.title}. ${isFlipped ? 'Showing details.' : 'Click to see details.'}`}
        >
            <div
                ref={innerRef}
                className="inner relative w-full h-full"
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full bg-[var(--theme-card-bg)] rounded-md border border-[var(--theme-card-border)] p-5 flex flex-col items-start justify-between text-left overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    
                    <div className="absolute inset-0 bg-no-repeat opacity-40 pointer-events-none" style={{ 
                        backgroundImage: `
                            radial-gradient(circle at var(--mx) var(--my), var(--theme-glow, #fff) 0%, transparent 15%),
                            linear-gradient(to right, transparent calc(var(--mx) - 0.5px), var(--theme-glow, #fff) var(--mx), transparent calc(var(--mx) + 0.5px)),
                            linear-gradient(to bottom, transparent calc(var(--my) - 0.5px), var(--theme-glow, #fff) var(--my), transparent calc(var(--my) + 0.5px))
                        `,
                        backgroundBlendMode: 'soft-light'
                    }} />

                     <div className="absolute inset-0 bg-repeat opacity-10 pointer-events-none" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '1rem 1rem'
                     }}/>

                    <header className="w-full">
                        <div className="flex justify-between items-center text-xs font-mono uppercase">
                            <span className="px-2 py-1 rounded bg-[var(--theme-tag-bg)] text-[var(--theme-tag-text)] ">{badge.domain}</span>
                            <span className="text-slate-400">{badge.rarity}</span>
                        </div>
                        <h2 className="text-xl font-bold mt-4 text-slate-100">{badge.title}</h2>
                    </header>
                    
                    <div className="w-full">
                        <i className={`${badge.icon} text-3xl text-[var(--theme-primary)] mb-4`}></i>
                        <p className="text-sm text-slate-300">
                            {badge.tagline}
                        </p>
                        <div className="border-t border-white/10 mt-4 pt-3 space-y-1.5 text-xs">
                           {badge.value_props.map(prop => (
                               <div key={prop} className="flex items-center gap-2">
                                   <i className="fa-solid fa-check-circle text-[var(--theme-primary)]/50"></i>
                                   <span className="text-slate-400">{prop}</span>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>

                {/* Card Back */}
                <CardBack badge={badge} />
            </div>
            
            <SceneBackdrop3D isIntersecting={isIntersecting} />
        </div>
    );
};

export default BadgeCard;
