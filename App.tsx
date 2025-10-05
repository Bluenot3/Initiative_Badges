
import React, { useState, useEffect } from 'react';
import BadgeGrid from './components/BadgeGrid';

type Theme = 'mint' | 'plum';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('mint');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'mint' ? 'plum' : 'mint'));
    };

    return (
        <>
            <div className="main-bg"></div>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <header className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-secondary)] to-[var(--theme-primary)]">
                        Strategic Initiative Dossiers
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        A classified collection of high-impact initiatives for the next decade. Analyze a card to review the mission briefing.
                    </p>
                     <div className="mt-6 flex justify-center">
                        <button 
                            onClick={toggleTheme} 
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[var(--theme-secondary)] to-[var(--theme-primary)] group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[var(--theme-bg-end)] rounded-md group-hover:bg-opacity-0">
                                Toggle Theme: {theme === 'mint' ? 'Amber' : 'Blueprint'}
                            </span>
                        </button>
                    </div>
                </header>

                <BadgeGrid />
            </main>
        </>
    );
};

export default App;
