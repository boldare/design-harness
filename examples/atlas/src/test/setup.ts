// Runs in the browser before every test file: the tokens and the canvas.
// The web fonts come from previewHead (vitest.config.ts): a <link> added here would land in every recorded frame.
import '../styles/tokens.css';
import './canvas.css';
