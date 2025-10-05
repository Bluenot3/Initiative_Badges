
import React from 'react';
import { Badge } from '../types';

interface CardBackProps {
    badge: Badge;
}

const InfoSection: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-secondary)]">{label}</dt>
        <dd className="mt-1 text-sm text-slate-300">{children}</dd>
    </div>
);

const CardBack: React.FC<CardBackProps> = ({ badge }) => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[var(--theme-bg-end)] rounded-md p-5 text-left overflow-y-auto custom-scrollbar" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
            <h3 className="text-lg font-bold text-[var(--theme-primary)]">{badge.title}</h3>
            <div className="mt-3 space-y-4">
                <dl className="space-y-4">
                    <InfoSection label="Core Duties">
                         <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                            {badge.core_duties.map((duty, i) => <li key={i}>{duty}</li>)}
                        </ul>
                    </InfoSection>

                    <InfoSection label="Tech Stack">
                         <div className="flex flex-wrap gap-1.5 mt-1">
                            {badge.stack.map((tech, i) => <code key={i} className="px-2 py-0.5 text-xs bg-slate-700/50 text-sky-300 rounded">{tech}</code>)}
                        </div>
                    </InfoSection>

                    <div className="grid grid-cols-2 gap-x-4">
                      <InfoSection label="Future Titles">
                        {badge.future_titles.join(', ')}
                      </InfoSection>
                      <InfoSection label="Adjacent Roles">
                        {badge.adjacent_roles.join(', ')}
                      </InfoSection>
                    </div>

                    <InfoSection label="Key Performance Indicators (KPIs)">
                        {badge.kpis.join(' • ')}
                    </InfoSection>
                    
                    <InfoSection label="100-Day Plan">
                        <p className="font-mono text-xs">{badge.plan_100_days}</p>
                    </InfoSection>

                    <div className="grid grid-cols-2 gap-x-4">
                      <InfoSection label="Compliance Focus">
                          {badge.compliance}
                      </InfoSection>
                      <InfoSection label="Longevity">
                          {badge.longevity}
                      </InfoSection>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default CardBack;
