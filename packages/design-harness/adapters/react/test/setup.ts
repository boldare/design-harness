// Runs in the browser before every test file: the system's tokens and canvas, which the preset finds through the manifest.
// The web fonts come from previewHead (describe-me/options.mjs), because a <link> added here would land in every recorded frame.
import 'virtual:design-harness/system';
