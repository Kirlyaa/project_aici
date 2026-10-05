import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', '"Plus Jakarta Sans"', 'Figtree', ...defaultTheme.fontFamily.sans],
                mono: [...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: {
                    950: '#062d3d',
                    900: '#08455c',
                    800: '#0B6282', // Official AiCI primary blue/teal
                    700: '#0d769c',
                    600: '#046BD2', // Official AiCI link/accent blue
                    500: '#0e8fb7',
                    200: '#d1e6ef',
                    100: '#EDF2F7', // Official AiCI section light gray
                    50: '#F1F4F9',
                    red: '#E62C29', // Official AiCI CTA red button
                },
                teal: {
                    50: '#F1F4F9',
                    100: '#EDF2F7',
                    200: '#d1e6ef',
                    300: '#94c2d6',
                    400: '#4a9cbe',
                    500: '#0e8fb7',
                    600: '#0B6282', // Maps teal-600 directly to Official AiCI brand #0B6282
                    700: '#08455c', // Maps teal-700 directly to Official AiCI dark teal #08455c
                    800: '#07394c',
                    900: '#062d3d',
                    950: '#031c26',
                },
            },
        },
    },

    plugins: [forms],
};
