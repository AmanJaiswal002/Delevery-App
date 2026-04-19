import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../src/index.css';

// This is a secondary entry point if the user wants a separate seller module.
// In a standard single-page app, this might not be used.
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
