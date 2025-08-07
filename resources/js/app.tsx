import '../css/app.css';
import '../css/sweetalert-simple.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Add global logout loading detection
let isLogoutInProgress = false;

// Listen for logout-related navigation
document.addEventListener('DOMContentLoaded', () => {
    // Override the default form submission for logout
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const form = target.closest('form');
        const link = target.closest('a[href*="logout"]');
        
        if ((form && form.action.includes('logout')) || link) {
            if (!isLogoutInProgress) {
                isLogoutInProgress = true;
                // You can add global logout animation here if needed
            }
        }
    });
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
