import '../css/app.css';
import './bootstrap';

import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AdminLayout from '@/Layouts/AdminLayout';
import type { ReactNode } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ).then((module) => {
            const pageModule = module as { default: ResolvedComponent };

            if (name.startsWith('SuperAdmin/') || name.startsWith('Tutor/') || name === 'Profile/Edit') {
                // Return an element so AdminLayout's hooks run inside the Inertia page context.
                pageModule.default.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
            }

            return pageModule;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
