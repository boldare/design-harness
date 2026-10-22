// Runs in the browser before every test file: the tokens, the canvas and the fonts of the Atlas text styles.
import '../styles/tokens.css';
import './canvas.css';
import fontsHead from '../styles/fonts.html?raw';

document.head.insertAdjacentHTML('beforeend', fontsHead);
