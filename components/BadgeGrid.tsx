import React, { useEffect, useState } from 'react';
import BadgeCard from './BadgeCard';
import { Badge } from '../types';

// Let TypeScript know anime is available on the window object
declare const anime: any;

const BadgeGrid: React.FC = () => {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        fetch('./data/badges.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setBadges(data.badges);
            })
            .catch(error => {
                console.error("Error fetching badges data:", error);
            });
    }, []);

    useEffect(() => {
        if (badges.length > 0) {
            const grid = document.querySelector('.badge-grid');
            if (grid) {
                // Ensure elements are in the DOM before animating
                const targets = grid.querySelectorAll('.badge-card-wrapper');
                if (targets.length > 0) {
                    const columns = Math.floor((grid.clientWidth || 280) / 280) || 1;
                    const rows = Math.ceil(badges.length / columns);
                    
                    anime({
                        targets: targets,
                        translateY: [20, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(100, { grid: [columns, rows], from: 'center' }),
                        duration: 800,
                        easing: 'easeOutExpo'
                    });
                }
            }
        }
    }, [badges]);

    return (
        <div
            className="badge-grid grid gap-7"
            style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                perspective: '1400px'
            }}
        >
            {badges.map((badge) => (
                <div key={badge.title} className="badge-card-wrapper opacity-0">
                    <BadgeCard badge={badge} />
                </div>
            ))}
        </div>
    );
};

export default BadgeGrid;
